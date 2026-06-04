import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/fb_community?authSource=admin';
const client = new MongoClient(MONGO_URI);

let _db = null;

export async function connectDB() {
  if (_db) return _db;
  await client.connect();
  _db = client.db('fb_community');
  return _db;
}

export function getDB() {
  if (!_db) throw new Error('Database not connected. Call connectDB() first.');
  return _db;
}

export async function closeDB() {
  await client.close();
}
