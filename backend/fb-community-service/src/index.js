import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/community/posts', async (req, res) => {
    try {
        const db = await connectDB();
        const posts = await db.collection('community_posts')
            .find({})
            .sort({ updatedAt: -1 })
            .limit(100)
            .toArray();
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
    console.log(`🌐 Community API Server running on port ${PORT}`);
});
