import { chromium } from 'playwright';
import fs from 'fs';
import { parsePostContent } from './parser.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

export async function runScraper() {
    console.log('🚀 Bắt đầu quét Facebook Groups...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    if (fs.existsSync(process.env.FB_COOKIES_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(process.env.FB_COOKIES_PATH));
        await context.addCookies(cookies);
    }

    const page = await context.newPage();
    const db = await connectDB();
    const collection = db.collection('community_posts');
    const groupUrls = process.env.GROUP_URLS.split(',');

    for (const url of groupUrls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            for (let i = 0; i < 3; i++) {
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(3000);
            }
            const posts = await page.$$('div[data-ad-preview="message"]');
            for (const post of posts) {
                const text = await post.innerText();
                if (text.toLowerCase().includes('cầu lông') || text.toLowerCase().includes('giao lưu')) {
                    const structuredData = parsePostContent(text);
                    await collection.updateOne(
                        { rawText: text },
                        { $set: { ...structuredData, url, updatedAt: new Date() } },
                        { upsert: true }
                    );
                }
            }
            console.log(`✅ Đã quét xong group: ${url}`);
        } catch (e) {
            console.error(`❌ Lỗi khi quét ${url}: ${e.message}`);
        }
    }
    await browser.close();
}
