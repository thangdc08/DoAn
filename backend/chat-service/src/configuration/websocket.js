import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { jwtSecret, trustGatewayJwt } from './index.js';
import { myConversations } from '../service/conversationService.js';
import { getProfileByAccId } from '../client/userClient.js';
import { sendMessage } from '../service/chatService.js';

const connections = new Map();
const subscriptions = new Map();

export const sendToUser = (userId, data, destination) => {
  const sessions = connections.get(userId);
  if (!sessions || sessions.size === 0) return false;

  const dest = destination || `/user/${userId}/queue/conversations`;
  sessions.forEach((ws) => sendMessageToWs(ws, dest, data));
  return true;
};

const sendMessageToWs = (ws, destination, data) => {
  const subs = subscriptions.get(ws);
  const subId = subs?.get(destination);
  if (!subId) return;

  const out = `MESSAGE\ndestination:${destination}\nmessage-id:msg-${Date.now()}\nsubscription:${subId}\ncontent-type:application/json\n\n${JSON.stringify(data)}\0`;
  if (ws.readyState === 1) ws.send(out);
};

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws-chat' });

  wss.on('connection', (ws) => {
    let userId = null;
    let heartbeat = null;
    let sessionReq = null;
    let sessionToken = null;

    ws.on('message', async (data) => {
      try {
        const frame = parseFrame(data.toString());

        if (frame.command === 'CONNECT' || frame.command === 'STOMP') {
          const token = extractToken(frame.headers);
          if (!jwtSecret && !trustGatewayJwt) {
            throw new Error('Missing SECRET_KEY (or set TRUST_GATEWAY_JWT=true in dev)');
          }

          const payload = trustGatewayJwt ? jwt.decode(token) : jwt.verify(token, jwtSecret);
          if (!payload) throw new Error('Invalid token');

          sessionToken = token;
          sessionReq = { token, user: payload };

          const user = await getProfileByAccId(payload.sub, sessionReq, token);
          if (!user) {
            sendFrame(ws, 'ERROR', {}, 'Invalid user');
            ws.close();
            return;
          }

          userId = user.id;
          if (!connections.has(userId)) connections.set(userId, new Set());
          connections.get(userId).add(ws);

          subscriptions.set(ws, new Map());

          sendFrame(ws, 'CONNECTED', {
            version: '1.2',
            'heart-beat': '10000,10000',
          });

          heartbeat = setInterval(() => {
            if (ws.readyState === ws.OPEN) ws.send('\n');
          }, 10000);
          return;
        }

        if (frame.command === 'SUBSCRIBE') {
          const destination = frame.headers.destination;
          const subId = frame.headers.id;
          subscriptions.get(ws)?.set(destination, subId);

          const conversations = await myConversations(sessionReq);
          sendToUser(
            userId,
            {
              type: 'init_conversations',
              conversations: conversations.data,
              timestamp: new Date().toISOString(),
            },
            destination
          );
          return;
        }

        if (frame.command === 'SEND') {
          const destination = frame.headers.destination;
          const body = JSON.parse(frame.body || '{}');

          if (destination === '/app/chat.send') {
            const sendReq = {
              body: {
                ...body,
                message: body.message ?? body.content ?? '',
              },
              headers: {
                ...frame.headers,
                authorization: `Bearer ${sessionToken}`,
              },
              user: sessionReq?.user,
              token: sessionToken,
            };

            const result = await sendMessage(sendReq);
            sendFrame(ws, 'MESSAGE', { subscription: frame.headers.id || '0' }, JSON.stringify(result));
          }
        }
      } catch (err) {
        console.error('WebSocket error:', err.message);
        sendFrame(ws, 'ERROR', {}, err.message);
      }
    });

    ws.on('close', () => {
      if (heartbeat) clearInterval(heartbeat);

      if (userId) {
        const userSessions = connections.get(userId);
        if (userSessions) {
          userSessions.delete(ws);
          if (userSessions.size === 0) connections.delete(userId);
        }
      }

      subscriptions.delete(ws);
    });
  });

  function parseFrame(data) {
    const lines = data.replace(/\r\n/g, '\n').split('\n');
    const command = lines[0].trim();
    const headers = {};
    let i = 1;

    while (i < lines.length && lines[i].trim()) {
      const [k, ...v] = lines[i].split(':');
      headers[k.trim()] = v.join(':').trim();
      i += 1;
    }

    const body = lines.slice(i + 1).join('\n').replace(/\0$/, '');
    return { command, headers, body };
  }

  function extractToken(headers) {
    const auth = headers.Authorization || headers.authorization || headers.login;
    if (!auth) throw new Error('Missing Authorization');
    return auth.replace(/^Bearer\s*/i, '');
  }

  function sendFrame(ws, command, headers = {}, body = '') {
    if (ws.readyState !== ws.OPEN) return;

    let out = `${command}\n`;
    for (const [k, v] of Object.entries(headers)) out += `${k}:${v}\n`;
    out += `\n${body}\0`;

    ws.send(out);
  }
};
