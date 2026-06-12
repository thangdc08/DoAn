import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePostContent, isPostDateValid, isPostComplete, extractPosterName, parseFBTimestampToDate } from './src/parser.js';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYWORDS = ['cầu lông', 'giao lưu', 'tìm kèo', 'tuyển', 'ghép đôi', 'kéo', 'đánh đơn', 'đánh đôi', 'pass', 'nhượng', 'nhượng lại', 'pass ca', 'nhượng ca'];

async function main() {
  const groupUrls = (process.env.GROUP_URLS || '').split(',').map(u => u.trim()).filter(Boolean);
  if (groupUrls.length === 0) {
    console.log('⚠️ Không có GROUP_URLS trong .env');
    process.exit(1);
  }

  const outputPath = process.env.SCRAPE_OUTPUT_PATH || path.join(__dirname, 'data', 'scrape-result.json');
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`🚀 Scraper độc lập — ${groupUrls.length} group`);
  console.log(`📁 Output: ${outputPath}\n`);

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
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
  const TARGET_POSTS_PER_GROUP = 20;

  const rawPostsToProcess = [];

  // PHASE 1: Thu thập dữ liệu thô từ tất cả các nhóm
  for (let gi = 0; gi < groupUrls.length; gi++) {
    const url = groupUrls[gi];
    try {
      console.log(`🔍 [${gi + 1}/${groupUrls.length}] ${url}`);
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
      let sameRounds = 0;
      const MAX_SAME = 5;

      console.log(`⏳ Đang cuộn trang và thu thập đủ ít nhất ${TARGET_POSTS_PER_GROUP} bài đăng gần nhất...`);
      for (let s = 0; s < 30; s++) {
        // Mở khóa cuộn trang và xóa modal đăng nhập của Facebook nếu xuất hiện
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
            // Lấy text sơ bộ để kiểm tra trùng lặp nhanh
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
          sameRounds++;
          if (sameRounds >= MAX_SAME) {
            console.log(`⚠️ Hết bài mới ở nhóm này.`);
            break;
          }
        } else {
          sameRounds = 0;
        }
      }

      // Chụp ảnh màn hình debug nếu không đủ 20 bài
      if (collectedRawPosts.size < TARGET_POSTS_PER_GROUP) {
        const debugDir = path.join(__dirname, 'data');
        if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true });
        const screenshotPath = path.join(debugDir, `group_${gi + 1}_debug.png`);
        await page.screenshot({ path: screenshotPath }).catch(() => {});
        console.log(`📸 Đã chụp ảnh màn hình debug tại: ${screenshotPath}`);
      }

      // Đẩy tất cả bài viết thu thập được của nhóm này vào danh sách tổng
      const groupList = Array.from(collectedRawPosts.values());
      rawPostsToProcess.push(...groupList);
      console.log(`   ✅ Nhóm [${gi + 1}]: Đã thu thập thô được +${groupList.length} bài đăng.\n`);
    } catch (e) {
      console.error(`   ❌ Lỗi: ${e.message}\n`);
    }
    if (gi < groupUrls.length - 1) await page.waitForTimeout(3000);
  }

  await browser.close();
  console.log(`\n💻 Đã đóng trình duyệt Playwright. Bắt đầu xử lý bóc tách thông tin từ ${rawPostsToProcess.length} bài đăng...`);

  // PHASE 2: Xử lý bóc tách nội dung thô trong bộ nhớ offline
  const seenSessions = new Set();
  let totalSkippedDuplicate = 0;
  let totalSkippedExpired = 0;
  let totalSkippedIncomplete = 0;

  for (const rawPost of rawPostsToProcess) {
    try {
      const { rawText, posterName, postingDateText, url } = rawPost;

      if (!KEYWORDS.some(kw => rawText.toLowerCase().includes(kw))) continue;

      const parsed = parsePostContent(rawText);

      // Nếu không trích xuất được ngày chơi từ nội dung bài viết, lấy ngày đăng bài làm ngày chơi
      if (!parsed.date || parsed.date === 'Không xác định' || parsed.date === 'Không rõ') {
        const fallbackDate = parseFBTimestampToDate(postingDateText);
        if (fallbackDate) {
          parsed.date = fallbackDate;
        }
      }

      // Kiểm tra ngày giờ không được nhỏ hơn ngày hiện tại
      if (!isPostDateValid(parsed.date)) {
        totalSkippedExpired++;
        continue;
      }

      // Kiểm tra thông tin đầy đủ
      if (!isPostComplete(parsed)) {
        totalSkippedIncomplete++;
        continue;
      }

      // Lọc trùng lặp dựa trên tổ hợp: địa điểm, ngày, giờ, trình độ
      const normLocation = (parsed.location || '').toLowerCase().replace(/^sân\s+/i, '').replace(/[^a-z0-9à-ỹ]/g, '');
      const normDate = (parsed.date || '').replace(/[^0-9\/]/g, '');
      const normTime = (parsed.time || '').toLowerCase().replace(/[^a-z0-9\-]/g, '');
      const normLevel = (parsed.level || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const dupKey = `${normLocation}_${normDate}_${normTime}_${normLevel}`;

      if (seenSessions.has(dupKey)) {
        totalSkippedDuplicate++;
        console.log(`⏭️ Bỏ qua bài viết trùng lặp (cùng khung giờ/sân): ${(parsed.title || 'không có tiêu đề').slice(0, 40)}`);
        continue;
      }
      seenSessions.add(dupKey);

      if (posterName) {
        parsed.posterName = posterName;
      } else if (!parsed.posterName) {
        parsed.posterName = extractPosterName(rawText);
      }

      const existing = allPosts.find(p => p.rawText === rawText);
      if (existing) continue;

      allPosts.push({ ...parsed, rawText, url, scrapedAt: new Date().toISOString() });
      totalNew++;
      console.log(`✅ [Scrape Script] Đã lưu bài viết hợp lệ: ${parsed.title} (Ngày: ${parsed.date})`);
    } catch {}
  }

  try {
    fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2), 'utf8');
    console.log(`\n💾 Đã lưu ${allPosts.length} bài viết vào ${outputPath}`);
  } catch (e) {
    console.error('⚠️ Không thể ghi file output:', e.message);
  }

  console.log(`\n🏁 Hoàn thành! Đã quét ${groupUrls.length} group — ${totalNew} bài mới.`);
  console.log(`   ⏭️ Bỏ qua ${totalSkippedExpired} bài quá hạn, ${totalSkippedIncomplete} bài thiếu thông tin, ${totalSkippedDuplicate} bài trùng lặp.`);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
