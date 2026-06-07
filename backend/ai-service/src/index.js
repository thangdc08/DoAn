import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import recommendationRoutes from './routes/recommendations.js';
import { initEureka } from './eureka-client.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 8091;

if (process.env.ENABLE_EUREKA !== 'false') {
  initEureka('ai-service', PORT);
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const GATEWAY_URL = 'http://localhost:8080';

// Fetch real venues from the database via API Gateway
async function fetchRealVenues() {
  try {
    const res = await fetch(`${GATEWAY_URL}/venues/api/venues`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.error('[AI] Error fetching real venues:', err.message);
    return [];
  }
}

// Fetch real community match posts via API Gateway
async function fetchRealMatches(params = {}) {
  try {
    const url = new URL(`${GATEWAY_URL}/communities/api/community/match-posts`);
    if (params.q) url.searchParams.append('q', params.q);
    if (params.level) url.searchParams.append('level', params.level);
    const res = await fetch(url.toString());
    const data = await res.json();
    return data.result?.content || [];
  } catch (err) {
    console.error('[AI] Error fetching real matches:', err.message);
    return [];
  }
}

// Local parser + live database query integration
async function getRealTimeLocalResponse(message) {
  const query = message.toLowerCase();
  const today = new Date().toISOString().split('T')[0];
  
  let action = 'DEFAULT';
  let reply = 'Xin chào! Mình là SmashMate AI. Mình có thể giúp bạn tìm kiếm sân cầu lông trống, đặt lịch sân nhanh chóng hoặc tìm các kèo đấu giao lưu phù hợp. Bạn muốn tìm sân hay tìm kèo đấu hôm nay?';
  const params = {
    q: null,
    level: null,
    city: null,
    date: null
  };

  // Extract level using word boundaries
  const levels = ['tb++', 'tb+', 'tb-', 'tb', 'tby+', 'tby', 'y+', 'y', 'tbk'];
  for (const lvl of levels) {
    const escapedLvl = lvl.replace(/\+/g, '\\+');
    const regex = new RegExp(`(?:^|\\s|\\/)${escapedLvl}(?:$|\\s|\\/)`, 'i');
    if (regex.test(query)) {
      params.level = lvl.toUpperCase();
      break;
    }
  }

  // Extract location/search query
  if (query.includes('cầu giấy')) {
    params.q = 'Cầu Giấy';
  } else if (query.includes('lê văn lương')) {
    params.q = 'Lê Văn Lương';
  } else if (query.includes('nguyễn xiển')) {
    params.q = 'Nguyễn Xiển';
  }

  // Set city
  if (query.includes('hà nội') || query.includes('hn')) {
    params.city = 'Hà Nội';
  } else if (query.includes('hồ chí minh') || query.includes('hcm') || query.includes('sài gòn')) {
    params.city = 'Hồ Chí Minh';
  }

  // Date parsing
  if (query.includes('tối nay') || query.includes('hôm nay')) {
    params.date = today;
  } else if (query.includes('ngày mai') || query.includes('mai')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    params.date = tomorrow.toISOString().split('T')[0];
  }

  // Query actual microservices dynamically based on detected intent
  if (query.includes('kèo') || query.includes('giao lưu') || query.includes('chơi') || query.includes('lớp dạy') || query.includes('tìm nhóm')) {
    action = 'FILTER_MATCHES';
    const matches = await fetchRealMatches({ q: params.q, level: params.level });
    
    if (matches && matches.length > 0) {
      const listText = matches
        .slice(0, 3)
        .map(m => `- **${m.title}** (Trình độ: ${m.level || 'Tự do'}, Sân: ${m.venueName || 'Chưa chọn'})`)
        .join('\n');
      reply = `Mình đã tìm thấy các kèo đấu giao lưu thực tế trong hệ thống:\n${listText}\n\nBạn có thể xem chi tiết hoặc tham gia các kèo đấu này trên trang Cộng đồng nhé!`;
    } else {
      reply = `Hiện tại chưa có kèo đấu giao lưu nào đang mở phù hợp với trình độ hoặc địa điểm bạn yêu cầu. Bạn có thể tự tạo kèo đấu mới trên trang Cộng đồng nhé!`;
    }
  } else if (query.includes('sân') || query.includes('đặt sân') || query.includes('sân trống') || query.includes('thuê sân')) {
    action = 'FILTER_COURTS';
    const venues = await fetchRealVenues();
    
    // Filter venues in memory by keyword if location is specified
    const filtered = params.q
      ? venues.filter(v => v.name.toLowerCase().includes(params.q.toLowerCase()) || v.address.toLowerCase().includes(params.q.toLowerCase()))
      : venues;

    if (filtered && filtered.length > 0) {
      const listText = filtered
        .slice(0, 3)
        .map(v => `- **${v.name}** (${v.address || 'Hà Nội'})`)
        .join('\n');
      reply = `Mình tìm thấy danh sách sân cầu lông có sẵn thực tế trong hệ thống:\n${listText}\n\nBạn có thể click bên dưới để xem chi tiết bản đồ sân và đặt lịch nhé!`;
    } else {
      reply = `Hiện tại chưa có thông tin sân nào phù hợp ở khu vực ${params.q || 'bạn tìm kiếm'} trong cơ sở dữ liệu.`;
    }
  }

  return {
    reply,
    action,
    params
  };
}

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log(`[AI] Processing message: "${message}"`);

  // Verify if API key is valid (starts with standard Google prefix 'AIzaSy')
  const isValidApiKey = GEMINI_API_KEY && GEMINI_API_KEY.trim().startsWith('AIzaSy');

  if (!isValidApiKey) {
    console.log('[AI] Invalid/missing Gemini API key. Running Real-Time Local parser.');
    const result = await getRealTimeLocalResponse(message);
    return res.json(result);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Define Tools (Function Declarations) for Gemini
    const searchVenuesDeclaration = {
      name: "searchVenues",
      description: "Tìm kiếm danh sách sân cầu lông thực tế trong hệ thống dựa trên địa điểm, quận huyện hoặc tên sân.",
      parameters: {
        type: "OBJECT",
        properties: {
          location: { type: "STRING", description: "Tên địa điểm hoặc quận huyện cần tìm (Ví dụ: Cầu Giấy, Lê Văn Lương)" }
        }
      }
    };

    const searchMatchPostsDeclaration = {
      name: "searchMatchPosts",
      description: "Tìm kiếm các kèo đấu giao lưu thực tế trong cộng đồng dựa trên địa điểm hoặc trình độ.",
      parameters: {
        type: "OBJECT",
        properties: {
          q: { type: "STRING", description: "Từ khóa tìm kiếm hoặc địa điểm (Ví dụ: Cầu Giấy)" },
          level: { type: "STRING", description: "Trình độ yêu cầu (Ví dụ: TB+, TBY, Y)" }
        }
      }
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ functionDeclarations: [searchVenuesDeclaration, searchMatchPostsDeclaration] }]
    });

    const todayDate = new Date().toISOString().split('T')[0];
    const systemPrompt = `
You are SmashMate AI, a smart assistant for a Badminton Platform (BadmintonHub).
Your task is to analyze a Vietnamese search query and extract the user's intent.
You can use the searchVenues or searchMatchPosts tools to query live data from the database.

If the user's intent matches a tool, you MUST return a function call to that tool.
If the user's intent does not match any tool, you MUST respond with a JSON object following this schema:
{
  "reply": "A friendly Vietnamese reply explaining how you can help.",
  "action": "DEFAULT",
  "params": {
    "q": null,
    "level": null,
    "city": null,
    "date": null
  }
}
`;

    const prompt = `${systemPrompt}\n\nUser query: "${message}"`;
    
    // Call Gemini API with 5-second timeout
    const apiCall = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API request timed out after 5 seconds')), 5000)
    );
    
    const result = await Promise.race([apiCall, timeoutPromise]);
    const response = result.response;
    
    // Handle Gemini Function Call (Tool Use)
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      console.log('[AI] Gemini requested tool call:', call.name, call.args);
      
      let action = 'DEFAULT';
      let params = { q: null, level: null, city: null, date: null };
      let reply = '';
      
      if (call.name === 'searchVenues') {
        action = 'FILTER_COURTS';
        const location = call.args.location || null;
        params.q = location;
        
        const venues = await fetchRealVenues();
        const filtered = location 
          ? venues.filter(v => v.name.toLowerCase().includes(location.toLowerCase()) || v.address.toLowerCase().includes(location.toLowerCase()))
          : venues;
        
        if (filtered.length > 0) {
          reply = `Mình đã tìm thấy ${filtered.length} sân tại ${location || 'hệ thống'}:\n` + 
                  filtered.slice(0, 3).map(v => `- **${v.name}** (${v.address})`).join('\n') +
                  `\n\nBạn có thể xem chi tiết danh sách sân ngay bên dưới nhé!`;
        } else {
          reply = `Hiện tại hệ thống chưa có sân nào hoạt động tại khu vực ${location || 'này'}.`;
        }
      } else if (call.name === 'searchMatchPosts') {
        action = 'FILTER_MATCHES';
        const q = call.args.q || null;
        const level = call.args.level || null;
        params.q = q;
        params.level = level;
        
        const matches = await fetchRealMatches({ q, level });
        if (matches.length > 0) {
          reply = `Mình đã tìm thấy ${matches.length} kèo đấu giao lưu phù hợp:\n` + 
                  matches.slice(0, 3).map(m => `- **${m.title}** (Trình độ: ${m.level || 'Tự do'}, Sân: ${m.venueName || 'Chưa chọn'})`).join('\n') +
                  `\n\nBạn có thể nhấp chọn kèo đấu trên trang Cộng đồng để xem chi tiết!`;
        } else {
          reply = `Hiện chưa có kèo đấu nào đang mở phù hợp với yêu cầu của bạn.`;
        }
      }
      
      return res.json({ reply, action, params });
    }
    
    // Normal text response (not calling a tool)
    const responseText = response.text();
    console.log('[AI] Gemini text response:', responseText);
    const parsed = JSON.parse(responseText.trim());
    res.json(parsed);
  } catch (e) {
    console.error('[AI] Error calling Gemini:', e.message);
    // Graceful fallback to real-time local search if Gemini fails/times out
    const fallbackResult = await getRealTimeLocalResponse(message);
    res.json({
      ...fallbackResult,
      reply: `${fallbackResult.reply} (Lưu ý: Hệ thống đang tạm thời hoạt động ở chế độ offline: ${e.message})`
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌐 AI Service running on port ${PORT}`);
  console.log(`  🤖 Chatbot: POST /chat`);
  console.log(`  💡 Recommendations: GET /recommendations/venues?userId=&city=&limit=`);
});
