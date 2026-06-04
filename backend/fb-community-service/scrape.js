import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePostContent } from './src/parser.js';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYWORDS = ['cầu lông', 'giao lưu', 'tìm kèo', 'tuyển', 'ghép đôi', 'kéo', 'đánh đơn', 'đánh đôi'];

async function main() {
  const groupUrls = (process.env.GROUP_URLS || '').split(',').filter(Boolean);
  if (groupUrls.length === 0) {
    console.log('⚠️ Không có GROUP_URLS trong .env');
    process.exit(1);
  }

  const outputPath = process.env.SCRAPE_OUTPUT_PATH || path.join(__dirname, 'data', 'scrape-result.json');
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`🚀 Scraper độc lập — ${groupUrls.length} group`);
  console.log(`📁 Output: ${outputPath}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'vi-VN',
  });

  const cookiesPath = process.env.FB_COOKIES_PATH || path.join(__dirname, 'data', 'cookies.json');
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
    await context.addCookies(cookies);
    console.log('🍪 Đã load cookies\n');
  } else {
    console.log('⚠️ Không thấy cookies, quét chế độ không đăng nhập\n');
  }

  const page = await context.newPage();
  const allPosts = [];
  let totalNew = 0;

  for (let gi = 0; gi < groupUrls.length; gi++) {
    const url = groupUrls[gi];
    try {
      console.log(`🔍 [${gi + 1}/${groupUrls.length}] ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      let prevCount = 0, sameRounds = 0;
      for (let s = 0; s < 20; s++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
        const count = await page.$$('div[data-ad-preview="message"], div[role="article"]').catch(() => []);
        if (count.length === prevCount) { sameRounds++; if (sameRounds >= 3) break; }
        else sameRounds = 0;
        prevCount = count.length;
        if (count.length > 200) break;
      }

      const elements = await page.$$('div[data-ad-preview="message"], div[role="article"]');
      console.log(`   📋 ${elements.length} elements`);
      const seen = new Set();

      for (const el of elements) {
        try {
          const text = await el.innerText();
          if (!text || text.trim().length < 20) continue;
          const key = text.trim().slice(0, 500);
          if (seen.has(key)) continue;
          seen.add(key);

          if (!KEYWORDS.some(kw => text.toLowerCase().includes(kw))) continue;

          const parsed = parsePostContent(text);
          const existing = allPosts.find(p => p.rawText === text);
          if (existing) continue;

          allPosts.push({ ...parsed, rawText: text, url, scrapedAt: new Date().toISOString() });
          totalNew++;
        } catch {}
      }
      console.log(`   ✅ ${totalNew} bài mới tổng\n`);
    } catch (e) {
      console.error(`   ❌ Lỗi: ${e.message}\n`);
    }
    if (gi < groupUrls.length - 1) await page.waitForTimeout(3000);
  }

  await browser.close();

  fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2), 'utf8');
  console.log(`💾 Đã lưu ${allPosts.length} bài vào ${outputPath}`);
  console.log('🏁 Xong!');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
