import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
export async function connectDB() {
    await client.connect();
    return client.db('fb_community');
}
export const dbClient = client;
