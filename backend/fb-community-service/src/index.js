import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runScraper } from './scraper.js';
import { connectDB, getDB } from './db.js';
import { initEureka } from './eureka-client.js';
import cron from 'node-cron';
import { scraperStatus } from './statusStore.js';
dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8089;

if (process.env.ENABLE_EUREKA !== 'false') {
  initEureka('fb-community-service', PORT);
}

app.get('/api/community/posts', async (req, res) => {
  try {
    const db = await connectDB();
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const posts = await db.collection('community_posts')
      .find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const mappedPosts = posts.map(post => {
      const firstLine = post.rawText ? post.rawText.split('\n')[0].trim() : '';
      const fallbackUser = firstLine && firstLine.length < 40 && !firstLine.includes('cầu lông') && !firstLine.includes('giao lưu') ? firstLine : 'Thành viên Facebook';
      return {
        ...post,
        content: post.content || post.rawText || '',
        userName: post.userName || fallbackUser,
        posterName: post.posterName || null,
      };
    });
    res.json(mappedPosts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/community/scrape', async (req, res) => {
  try {
    if (scraperStatus.status === 'scraping') {
      return res.status(409).json({ error: 'Tiến trình cào dữ liệu đang chạy, vui lòng không gửi lại!' });
    }
    console.log('🚀 [Scraper API] Khởi động tiến trình cào ngầm...');
    runScraper().catch(e => {
      console.error('❌ Lỗi tiến trình cào ngầm:', e);
    });
    res.json({ message: 'Tiến trình cào dữ liệu đã được bắt đầu trong nền...' });
  } catch (e) {
    console.error('❌ [Scraper API] Lỗi khởi động cào:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/community/scrape/status', (req, res) => {
  res.json({
    status: scraperStatus.status,
    logs: scraperStatus.logs
  });
});

app.get('/api/community/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cronjob tự động quét bài viết Facebook vào lúc 14:00 hàng ngày (Múi giờ Asia/Ho_Chi_Minh)
cron.schedule('0 14 * * *', async () => {
  console.log('⏰ [Cronjob] Bắt đầu tự động quét bài viết Facebook (14:00 hàng ngày)...');
  try {
    await runScraper();
    console.log('✅ [Cronjob] Quét bài viết Facebook tự động hoàn tất thành công!');
  } catch (e) {
    console.error('❌ [Cronjob] Lỗi khi tự động quét bài viết Facebook:', e);
  }
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});

let serverReady = false;
async function start() {
  const db = await connectDB();
  console.log('✅ MongoDB connected');

  // Seed data if empty
  try {
    const count = await db.collection('community_posts').countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding from data/scrape-result.json...');
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.resolve('data/scrape-result.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const posts = JSON.parse(fileContent);
        if (Array.isArray(posts) && posts.length > 0) {
          const prepared = posts.map(p => ({ ...p, updatedAt: p.scrapedAt ? new Date(p.scrapedAt) : new Date() }));
          await db.collection('community_posts').insertMany(prepared);
          console.log(`✅ Seeded ${prepared.length} posts into MongoDB.`);
        }
      } else {
        console.log('⚠️ No data/scrape-result.json found to seed.');
      }
    }
  } catch (seedErr) {
    console.error('❌ Failed to seed database:', seedErr);
  }

  serverReady = true;
  app.listen(PORT, () => {
    console.log(`🌐 Community API Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('❌ Failed to start:', err);
  process.exit(1);
});
