import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cookiesPath = process.env.FB_COOKIES_PATH || path.join(__dirname, 'data', 'cookies.json');

async function run() {
  console.log('🚀 Khởi động trình duyệt để đăng nhập Facebook...');
  console.log('📌 Vui lòng đăng nhập tài khoản của bạn trong cửa sổ trình duyệt vừa hiện lên.');

  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'] // Tránh bị Facebook phát hiện bot tự động
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'vi-VN',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto('https://web.facebook.com');

  console.log('⏳ Đang chờ bạn đăng nhập hoàn tất trên giao diện Facebook...');

  while (true) {
    try {
      const isClosed = !page || page.isClosed();
      if (isClosed) {
        console.log('🚪 Trình duyệt đã được đóng.');
        break;
      }

      // Kiểm tra sự xuất hiện của thanh điều hướng cá nhân của Facebook
      const loggedIn = await page.$('a[href*="/me/"], div[aria-label*="Trang cá nhân"], div[aria-label*="Your profile"], div[aria-label*="Profile"]').catch(() => null);
      if (loggedIn) {
        console.log('\n🎉 Phát hiện đăng nhập thành công! Đang lấy session cookies...');
        const cookies = await context.cookies();
        
        const outputDir = path.dirname(cookiesPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf8');
        console.log(`💾 Đã lưu session cookies thành công vào: ${cookiesPath}`);
        break;
      }
      
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('🚪 Trình duyệt đã được đóng.');
      break;
    }
  }

  await browser.close().catch(() => {});
  console.log('🏁 Hoàn thành! Bây giờ bạn đã có thể cào dữ liệu bình thường.');
}

run().catch(e => {
  console.error('❌ Lỗi:', e);
});
