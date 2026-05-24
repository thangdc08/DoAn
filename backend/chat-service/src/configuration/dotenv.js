import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envCandidates = [
  // Prefer service-local env file
  resolve(__dirname, '../.env'),
  resolve(__dirname, '../../.env'),
  resolve(__dirname, '../../../.env'),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const port = process.env.PORT || 8686;
export const dbUrl = process.env.URI_MONGODB_CHAT || 'mongodb://localhost:27017/chat';
export const jwtSecret = process.env.SECRET_KEY;
export const eurekaHost = process.env.EUREKA_HOST || 'localhost';
export const eurekaPort = process.env.EUREKA_PORT || 8761;
export const eurekaServicePath = process.env.EUREKA_SERVICE_PATH || '/eureka/apps/';
export const hostName = process.env.HOST_NAME || 'localhost';
export const ipAddress = process.env.IP_ADDRESS || '127.0.0.1';
export const apiBase = process.env.API_BASE_URL || 'http://localhost:8080';
export const kafkaServer = process.env.KAFKA_SERVER || 'localhost:9094';
export const enableKafka = process.env.ENABLE_KAFKA !== 'false';
export const enableEureka = process.env.ENABLE_EUREKA !== 'false';
export const trustGatewayJwt = process.env.TRUST_GATEWAY_JWT === 'true';
