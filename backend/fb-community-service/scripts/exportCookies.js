import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const COOKIES_PATH = process.env.FB_COOKIES_PATH || './data/cookies.json';

async function exportCookies() {
  const dir = path.dirname(COOKIES_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  console.log('🔑 Đang mở Facebook, đăng nhập bằng tay...');
  await page.goto('https://www.facebook.com', { waitUntil: 'domcontentloaded' });
  console.log('👉 Đăng nhập Facebook trên cửa sổ vừa mở, rồi quay lại đây bấm Enter...');

  process.stdin.once('data', async () => {
    const cookies = await context.cookies();
    const fbCookies = cookies.filter(c => c.domain.includes('facebook.com'));
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(fbCookies, null, 2));
    console.log(`✅ Đã lưu ${fbCookies.length} cookies vào ${COOKIES_PATH}`);
    await browser.close();
    process.exit(0);
  });
}

exportCookies().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
