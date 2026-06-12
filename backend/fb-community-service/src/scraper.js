import { chromium } from 'playwright';
import fs from 'fs';
import { parsePostContent, isPostComplete, isPostDateValid, extractPosterName, parseFBTimestampToDate } from './parser.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import { scraperStatus } from './statusStore.js';
dotenv.config();

const KEYWORDS = ['cầu lông', 'giao lưu', 'tìm kèo', 'tuyển', 'ghép đôi', 'kéo', 'đánh đơn', 'đánh đôi', 'pass', 'nhượng', 'nhượng lại', 'pass ca', 'nhượng ca'];

export async function runScraper() {
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    scraperStatus.addLog(msg);
  };
  console.error = (...args) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    scraperStatus.addLog(`❌ [LỖI] ${msg}`);
  };

  try {
    scraperStatus.setStatus('scraping');
    scraperStatus.clearLogs();

    console.log('🚀 Bắt đầu quét Facebook Groups...');
    const groupUrls = (process.env.GROUP_URLS || '').split(',').map(u => u.trim()).filter(Boolean);
    if (groupUrls.length === 0) {
      console.log('⚠️ Không có GROUP_URLS trong .env, không scrape gì cả');
      return;
    }
    console.log(`📋 Tổng cộng ${groupUrls.length} group cần quét`);

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
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

  // Xóa sạch các bài viết cũ trong MongoDB để loại bỏ hoàn toàn các bài viết lỗi từ thuật toán cũ
  console.log('🧹 Đang dọn dẹp các bài viết cũ khỏi cơ sở dữ liệu để bắt đầu cào mới...');
  await collection.deleteMany({});

  let totalNew = 0;
  let totalUpdated = 0;
  let totalSkippedExpired = 0;
  let totalSkippedIncomplete = 0;
  let totalSkippedDuplicate = 0;
  const TARGET_POSTS_PER_GROUP = 20;

  const rawPostsToProcess = [];

  // PHASE 1: Thu thập dữ liệu thô từ tất cả các nhóm
  for (let gi = 0; gi < groupUrls.length; gi++) {
    const url = groupUrls[gi];
    try {
      console.log(`\n🔍 [${gi + 1}/${groupUrls.length}] Quét: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      if (currentUrl.includes('/login') || currentUrl.includes('/checkpoint')) {
        console.log(`❌ Lỗi: Bị chặn và chuyển hướng sang trang đăng nhập: ${currentUrl}. Hãy chạy lại lệnh 'node login.js' để cập nhật session.`);
        break;
      }

      if (gi === 0) {
        const loggedIn = await page.$('a[href*="/me/"], div[aria-label*="Trang cá nhân"], div[aria-label*="Your profile"], div[aria-label*="Profile"]').catch(() => null);
        if (loggedIn) {
          console.log('🔑 Trạng thái: Đã đăng nhập Facebook thành công!');
        } else {
          console.log('⚠️ Cảnh báo: KHÔNG ĐĂNG NHẬP ĐƯỢC. Có thể phiên cookies đã hết hạn hoặc bị Facebook chặn checkpoint.');
        }
      }

      const collectedRawPosts = new Map();
      let sameCountRounds = 0;
      const MAX_SAME = 5;

      console.log(`⏳ Đang cuộn trang và thu thập đủ ít nhất ${TARGET_POSTS_PER_GROUP} bài đăng gần nhất...`);
      for (let scroll = 0; scroll < 30; scroll++) {
        // Mở khóa cuộn trang và xóa các modal đăng nhập xuất hiện chặn giao diện
        await page.evaluate(() => {
          try {
            const html = document.documentElement;
            const body = document.body;
            if (html) {
              html.style.setProperty('overflow', 'auto', 'important');
              html.style.setProperty('overflow-y', 'auto', 'important');
              html.style.setProperty('position', 'static', 'important');
              html.style.setProperty('height', 'auto', 'important');
            }
            if (body) {
              body.style.setProperty('overflow', 'auto', 'important');
              body.style.setProperty('overflow-y', 'auto', 'important');
              body.style.setProperty('position', 'static', 'important');
              body.style.setProperty('height', 'auto', 'important');
            }

            const dialogs = document.querySelectorAll('div[role="dialog"]');
            dialogs.forEach(dialog => {
              const txt = dialog.innerText || '';
              if (txt.includes('Đăng nhập') || txt.includes('Log In') || txt.includes('See more on Facebook') || txt.includes('xem thêm bài viết từ') || txt.includes('Tạo tài khoản mới')) {
                dialog.remove();
              }
            });

            const divs = document.querySelectorAll('div');
            divs.forEach(div => {
              const style = window.getComputedStyle(div);
              if (style.position === 'fixed' && parseInt(style.zIndex, 10) > 90) {
                const txt = div.innerText || '';
                if (txt.includes('Đăng nhập') || txt.includes('Log In') || txt.includes('See more on Facebook') || txt.trim() === '') {
                  div.remove();
                }
              }
            });
          } catch (e) {}
        }).catch(() => {});

        // Lấy tất cả bài viết đang hiện hữu trong DOM hiện tại
        const currentCards = await page.$$('div[role="article"]').catch(() => []);
        let newCountThisScroll = 0;

        for (const postCard of currentCards) {
          try {
            // Kiểm duyệt nhanh văn bản để tránh trùng lặp
            const tempMsgEl = await postCard.$('div[data-ad-preview="message"]');
            let tempText = '';
            if (tempMsgEl) {
              tempText = await tempMsgEl.innerText().catch(() => '');
            } else {
              tempText = await postCard.innerText().catch(() => '');
            }

            if (!tempText || tempText.trim().length < 20) continue;
            const normalized = tempText.trim().slice(0, 500);

            // Nếu bài đăng này chưa được lưu lại trong danh sách thu thập
            if (!collectedRawPosts.has(normalized)) {
              // Nhấn "Xem thêm" để có nội dung đầy đủ
              const seeMoreBtn = await postCard.$('span:has-text("Xem thêm"), div[role="button"]:has-text("Xem thêm"), a:has-text("Xem thêm"), span:has-text("See more"), div[role="button"]:has-text("See more"), a:has-text("See more")');
              if (seeMoreBtn) {
                await seeMoreBtn.click({ force: true }).catch(() => {});
                await page.waitForTimeout(300);
              }

              // Trích xuất nội dung văn bản hoàn chỉnh
              let fullText = '';
              const messageEl = await postCard.$('div[data-ad-preview="message"]');
              if (messageEl) {
                fullText = await messageEl.innerText().catch(() => '');
              } else {
                const dirAutos = await postCard.$$('div[dir="auto"]');
                for (const da of dirAutos) {
                  const daText = await da.innerText().catch(() => '');
                  if (daText.length > 20 && !daText.includes('Thích') && !daText.includes('Bình luận') && !daText.includes('Chia sẻ')) {
                    fullText = daText;
                    break;
                  }
                }
                if (!fullText) {
                  fullText = await postCard.innerText().catch(() => '');
                }
              }

              if (!fullText || fullText.trim().length < 20) continue;

              // Trích xuất tên người đăng bài
              let posterName = null;
              const headingEl = await postCard.$('h3, h2');
              if (headingEl) {
                const linkEl = await headingEl.$('a');
                if (linkEl) {
                  posterName = await linkEl.innerText().catch(() => null);
                } else {
                  posterName = await headingEl.innerText().catch(() => null);
                }
              }
              if (posterName) {
                posterName = posterName.split('\n')[0].trim();
              }

              // Trích xuất chuỗi thời gian đăng tương đối (ví dụ: "3 giờ", "Hôm qua")
              let postingDateText = null;
              const timeElements = await postCard.$$('a[role="link"], span[dir="auto"], span.x1rg5oqf');
              for (const el of timeElements) {
                const textContent = await el.innerText().catch(() => '');
                const cleanText = textContent.trim();
                const isFBTime = /^(vừa xong|\d+\s*(phút|giờ|ngày|ph|h|d)|hôm qua|ngày\s+\d+|\d+\s+tháng\s+\d+|\d+\s+thg\s+\d+|\d+\s+[a-zA-Z]+)/i.test(cleanText);
                if (isFBTime && cleanText.length < 30) {
                  postingDateText = cleanText;
                  break;
                }
              }

              // Trích xuất link chính xác của bài viết (permalink)
              let postUrl = url;
              try {
                const extractedUrl = await postCard.evaluate((el) => {
                  const anchors = Array.from(el.querySelectorAll('a'));
                  for (const a of anchors) {
                    const href = a.getAttribute('href');
                    if (!href) continue;
                    if (href.includes('/posts/') || href.includes('/permalink/') || href.includes('story_fbid=') || href.includes('/permalink.php')) {
                      let abs = href;
                      if (href.startsWith('/')) {
                        abs = 'https://www.facebook.com' + href;
                      }
                      try {
                        const urlObj = new URL(abs);
                        const cleanParams = new URLSearchParams();
                        ['story_fbid', 'id', 'fbid', 'sale_post_id'].forEach(p => {
                          if (urlObj.searchParams.has(p)) {
                            cleanParams.set(p, urlObj.searchParams.get(p));
                          }
                        });
                        urlObj.search = cleanParams.toString();
                        return urlObj.toString();
                      } catch (err) {
                        return abs;
                      }
                    }
                  }
                  return null;
                });
                if (extractedUrl) {
                  postUrl = extractedUrl;
                }
              } catch (e) {}

              collectedRawPosts.set(normalized, {
                rawText: fullText,
                posterName: posterName && posterName.length > 1 && !posterName.includes('cầu lông') ? posterName : null,
                postingDateText,
                url: postUrl
              });
              newCountThisScroll++;
            }
          } catch (e) {}
        }

        const scrollPos = await page.evaluate(() => window.scrollY).catch(() => 0);
        console.log(`   + Thu thập tiến độ: ${collectedRawPosts.size}/${TARGET_POSTS_PER_GROUP} bài thô (vị trí cuộn: ${scrollPos}px)...`);

        const currentUrl = page.url();
        if (currentUrl.includes('/login') || currentUrl.includes('/checkpoint')) {
          console.log(`❌ Lỗi: Bị chặn và chuyển hướng sang trang đăng nhập trong khi cuộn: ${currentUrl}`);
          break;
        }

        if (collectedRawPosts.size >= TARGET_POSTS_PER_GROUP) {
          console.log(`✅ Đã thu thập đủ ${collectedRawPosts.size} bài đăng.`);
          break;
        }

        // Cuộn xuống bằng chuột ảo để kích hoạt Intersection Observers và scroll listeners
        for (let i = 0; i < 6; i++) {
          await page.mouse.wheel(0, 400);
          await page.waitForTimeout(100);
        }
        await page.waitForTimeout(1500);

        if (newCountThisScroll === 0) {
          sameCountRounds++;
          if (sameCountRounds >= MAX_SAME) {
            console.log(`⚠️ Hết bài mới ở nhóm này.`);
            break;
          }
        } else {
          sameCountRounds = 0;
        }
      }

      // Chụp ảnh màn hình debug nếu không đủ 20 bài
      if (collectedRawPosts.size < TARGET_POSTS_PER_GROUP) {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        const screenshotPath = `./data/group_${gi + 1}_debug.png`;
        await page.screenshot({ path: screenshotPath }).catch(() => {});
        console.log(`📸 Đã chụp ảnh màn hình debug tại: ${screenshotPath}`);
      }

      // Đẩy tất cả bài viết thu thập được của nhóm này vào danh sách tổng
      const groupList = Array.from(collectedRawPosts.values());
      rawPostsToProcess.push(...groupList);
      console.log(`✅ Nhóm [${gi + 1}]: Hoàn tất giai đoạn 1 với +${groupList.length} bài đăng thô thu thập được.`);
    } catch (e) {
      console.error(`❌ Lỗi khi quét ${url}: ${e.message}`);
    }

    if (gi < groupUrls.length - 1) {
      await page.waitForTimeout(3000);
    }
  }

  // Đóng trình duyệt sớm để giải phóng tài nguyên
  await browser.close();
  console.log(`\n💻 Đã đóng trình duyệt Playwright. Bắt đầu xử lý bóc tách thông tin từ ${rawPostsToProcess.length} bài đăng trong bộ nhớ...`);

  // PHASE 2: Xử lý, phân tích NLP và lọc bài đăng hợp lệ để lưu vào DB
  const seenSessions = new Set();
  for (const rawPost of rawPostsToProcess) {
    try {
      const { rawText, posterName, postingDateText, url } = rawPost;

      const lower = rawText.toLowerCase();
      const matched = KEYWORDS.some(kw => lower.includes(kw));
      if (!matched) continue;

      const structuredData = parsePostContent(rawText);
      structuredData.rawText = rawText;

      // Nếu không trích xuất được ngày chơi từ nội dung bài viết, lấy ngày đăng bài làm ngày chơi
      if (!structuredData.date || structuredData.date === 'Không xác định' || structuredData.date === 'Không rõ') {
        const fallbackDate = parseFBTimestampToDate(postingDateText);
        if (fallbackDate) {
          structuredData.date = fallbackDate;
        }
      }

      // Kiểm tra ngày giờ không được nhỏ hơn ngày hiện tại
      if (!isPostDateValid(structuredData.date)) {
        totalSkippedExpired++;
        console.log(`⏭️ Bỏ qua bài quá hạn: ${(structuredData.title || 'không có tiêu đề').slice(0, 40)} (ngày: ${structuredData.date || 'không rõ'})`);
        continue;
      }

      // Kiểm tra thông tin đầy đủ
      if (!isPostComplete(structuredData)) {
        totalSkippedIncomplete++;
        const missing = ['location', 'level', 'time']
          .filter(f => !structuredData[f] || structuredData[f] === 'Không xác định' || structuredData[f] === 'Không rõ' || structuredData[f] === 'Liên hệ');
        console.log(`⚠️ Bỏ qua bài thiếu thông tin: ${(structuredData.title || 'không có tiêu đề').slice(0, 40)} (thiếu: ${missing.join(', ')})`);
        continue;
      }

      // Lọc trùng lặp dựa trên tổ hợp: địa điểm, ngày, giờ, trình độ
      const normLocation = (structuredData.location || '').toLowerCase().replace(/^sân\s+/i, '').replace(/[^a-z0-9à-ỹ]/g, '');
      const normDate = (structuredData.date || '').replace(/[^0-9\/]/g, '');
      const normTime = (structuredData.time || '').toLowerCase().replace(/[^a-z0-9\-]/g, '');
      const normLevel = (structuredData.level || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const dupKey = `${normLocation}_${normDate}_${normTime}_${normLevel}`;

      if (seenSessions.has(dupKey)) {
        totalSkippedDuplicate++;
        console.log(`⏭️ Bỏ qua bài viết trùng lặp (cùng khung giờ/sân): ${(structuredData.title || 'không có tiêu đề').slice(0, 40)}`);
        continue;
      }
      seenSessions.add(dupKey);

      if (posterName) {
        structuredData.posterName = posterName;
      } else if (!structuredData.posterName) {
        structuredData.posterName = extractPosterName(rawText);
      }

      const result = await collection.updateOne(
        { rawText: rawText },
        { $set: { ...structuredData, url, updatedAt: new Date() } },
        { upsert: true }
      );

      if (result.upsertedId) {
        totalNew++;
        console.log(`✅ Đã lưu bài viết mới: ${structuredData.title} (Ngày: ${structuredData.date})`);
      } else if (result.modifiedCount > 0) {
        totalUpdated++;
        console.log(`🔄 Đã cập nhật bài viết: ${structuredData.title}`);
      }
    } catch (e) {
      console.error('❌ Lỗi khi bóc tách / lưu bài viết:', e.message);
    }
  }

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
  console.log(`   ⏭️ Bỏ qua ${totalSkippedExpired} bài quá hạn, ${totalSkippedIncomplete} bài thiếu thông tin, ${totalSkippedDuplicate} bài trùng lặp.`);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    scraperStatus.setStatus('idle');
  }
}
