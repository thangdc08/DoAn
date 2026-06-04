import { chromium } from 'playwright';
import fs from 'fs';
import { parsePostContent } from './parser.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const KEYWORDS = ['cầu lông', 'giao lưu', 'tìm kèo', 'tuyển', 'ghép đôi', 'kéo', 'đánh đơn', 'đánh đôi'];

export async function runScraper() {
  console.log('🚀 Bắt đầu quét Facebook Groups...');
  const groupUrls = (process.env.GROUP_URLS || '').split(',').filter(Boolean);
  if (groupUrls.length === 0) {
    console.log('⚠️ Không có GROUP_URLS trong .env, không scrape gì cả');
    return;
  }
  console.log(`📋 Tổng cộng ${groupUrls.length} group cần quét`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'vi-VN',
  });

  if (process.env.FB_COOKIES_PATH && fs.existsSync(process.env.FB_COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(process.env.FB_COOKIES_PATH, 'utf8'));
    await context.addCookies(cookies);
    console.log('🍪 Đã load cookies từ file');
  } else {
    console.log('⚠️ Không tìm thấy cookies, quét chế độ không đăng nhập (chỉ bài public)');
  }

  const page = await context.newPage();
  const db = await connectDB();
  const collection = db.collection('community_posts');

  let totalNew = 0;
  let totalUpdated = 0;

  for (let gi = 0; gi < groupUrls.length; gi++) {
    const url = groupUrls[gi];
    try {
      console.log(`\n🔍 [${gi + 1}/${groupUrls.length}] Quét: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      let previousCount = 0;
      let sameCountRounds = 0;
      const MAX_SAME = 3;

      for (let scroll = 0; scroll < 20; scroll++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        const currentPosts = await page.$$('div[data-ad-preview="message"], div[role="article"]').catch(() => []);
        if (currentPosts.length === previousCount) {
          sameCountRounds++;
          if (sameCountRounds >= MAX_SAME) break;
        } else {
          sameCountRounds = 0;
          previousCount = currentPosts.length;
        }
        if (currentPosts.length > 200) break;
      }

      const allPostElements = await page.$$('div[data-ad-preview="message"], div[role="article"]');
      console.log(`📋 Tìm thấy ${allPostElements.length} elements trong group`);

      const seen = new Set();
      let groupNew = 0;

      for (const post of allPostElements) {
        try {
          const text = await post.innerText();
          if (!text || text.trim().length < 20) continue;

          const normalized = text.trim().slice(0, 500);
          if (seen.has(normalized)) continue;
          seen.add(normalized);

          const lower = text.toLowerCase();
          const matched = KEYWORDS.some(kw => lower.includes(kw));
          if (!matched) continue;

          const structuredData = parsePostContent(text);
          structuredData.rawText = text;

          const result = await collection.updateOne(
            { rawText: text },
            { $set: { ...structuredData, url, updatedAt: new Date() } },
            { upsert: true }
          );

          if (result.upsertedId) {
            groupNew++;
            totalNew++;
          } else if (result.modifiedCount > 0) {
            totalUpdated++;
          }
        } catch (e) {
          // skip individual post errors
        }
      }
      console.log(`✅ Group [${gi + 1}]: +${groupNew} bài mới | Tổng: ${totalNew} mới, ${totalUpdated} cập nhật`);
    } catch (e) {
      console.error(`❌ Lỗi khi quét ${url}: ${e.message}`);
    }

    if (gi < groupUrls.length - 1) {
      await page.waitForTimeout(3000);
    }
  }

  await browser.close();

  const outputPath = process.env.SCRAPE_OUTPUT_PATH || './data/scrape-result.json';
  try {
    const allPosts = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2), 'utf8');
    console.log(`💾 Đã lưu ${allPosts.length} bài viết vào ${outputPath}`);
  } catch (e) {
    console.error('⚠️ Không thể ghi file output:', e.message);
  }

  console.log(`\n🏁 Hoàn thành! Đã quét ${groupUrls.length} group — ${totalNew} bài mới, ${totalUpdated} bài cập nhật.`);
}
