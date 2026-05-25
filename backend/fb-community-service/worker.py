import os
import json
import asyncio
import re
from datetime import datetime
from pymongo import MongoClient
from playwright.async_api import async_playwright
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Cấu hình
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:adminpassword@localhost:27017/fb_community?authSource=admin")
COOKIES_PATH = os.getenv("FB_COOKIES_PATH", "./data/cookies.json")
GROUP_URLS = os.getenv("GROUP_URLS", "").split(",")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Cấu hình AI Gemini
genai.configure(api_key=GEMINI_API_KEY)
ai_model = genai.GenerativeModel('gemini-pro')

class AIParser:
    @staticmethod
    async def parse(text):
        """Sử dụng AI Gemini để trích xuất thông tin có cấu trúc từ văn bản thô"""
        prompt = f"""
        Bạn là một chuyên gia phân tích dữ liệu cầu lông.
        Hãy trích xuất các thông tin sau từ bài viết tuyển giao lưu cầu lông dưới đây.
        Yêu cầu: Trả về kết quả DUY NHẤT định dạng JSON, không giải thích gì thêm, không dùng markdown.

        Các trường cần lấy:
        - location: Địa điểm, tên sân hoặc quận/huyện.
        - time: Thời gian giao lưu (giờ, ngày).
        - slots: Số lượng người cần tuyển (chỉ trả về số, hoặc 'Không rõ').
        - contact: Số điện thoại hoặc cách thức liên hệ.
        - level: Trình độ yêu cầu (ví dụ: trung bình, khá, chuyên nghiệp). Nếu không có thì để 'Không yêu cầu'.

        Nội dung bài viết:
        "{text}"

        JSON Output:
        """
        try:
            response = ai_model.generate_content(prompt)
            # Loại bỏ các ký tự markdown nếu AI trả về
            json_text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(json_text)
        except Exception as e:
            print(f"⚠️ AI Parsing error: {e}")
            return {
                "location": "Không xác định",
                "time": "Liên hệ",
                "slots": "Không rõ",
                "contact": "Không rõ",
                "level": "Không yêu cầu"
            }

async def scrape_groups():
    print("🚀 Python AI-Worker: Bắt đầu thu thập dữ liệu...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context_args = {}
        if os.path.exists(COOKIES_PATH):
            context_args['storage_state'] = COOKIES_PATH
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            **context_args
        )
        page = await context.new_page()
        client = MongoClient(MONGO_URI)
        db = client['fb_community']
        collection = db['community_posts']

        total_collected = 0
        max_posts = 50
        group_urls = GROUP_URLS[:10] # Giới hạn 10 group đầu tiên

        for url in group_urls:
            if not url or total_collected >= max_posts:
                continue
            try:
                print(f"🔍 Đang quét group {group_urls.index(url)+1}/10: {url}")
                await page.goto(url, wait_until="networkidle")

                # Cuộn trang để load bài viết
                for _ in range(3):
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await asyncio.sleep(3)

                posts = await page.query_selector_all('div[role="article"]')
                for post in posts:
                    if total_collected >= max_posts:
                        break

                    try:
                        user_element = await post.query_selector('strong span[dir="auto"], a[role="link"] strong')
                        user_name = await user_element.inner_text() if user_element else "Ẩn danh"

                        content_element = await post.query_selector('div[data-ad-preview="message"]')
                        if not content_element: continue

                        content = await content_element.inner_text()
                        if "cầu lông" in content.lower() or "giao lưu" in content.lower():
                            # Kiểm tra xem bài viết đã tồn tại chưa để tránh tính trùng vào quota 50 bài
                            exists = await asyncio.to_thread(collection.count_documents, {"content": content})

                            parsed_info = await AIParser.parse(content)

                            post_data = {
                                "userName": user_name,
                                "content": content,
                                "location": parsed_info.get("location", "Không xác định"),
                                "time": parsed_info.get("time", "Liên hệ"),
                                "slots": parsed_info.get("slots", "Không rõ"),
                                "contact": parsed_info.get("contact", "Không rõ"),
                                "level": parsed_info.get("level", "Không yêu cầu"),
                                "url": url,
                                "updatedAt": datetime.utcnow()
                            }
                            await asyncio.to_thread(
                                collection.update_one,
                                {"content": content},
                                {"$set": post_data},
                                upsert=True
                            )
                            if not exists:
                                total_collected += 1
                            print(f"✅ [{total_collected}/{max_posts}] Đã lưu bài viết từ {user_name}")
                    except Exception as e:
                        print(f"⚠️ Lỗi khi xử lý bài viết: {e}")
                        continue
                print(f"✅ Xong group: {url}")
            except Exception as e:
                print(f"❌ Lỗi nghiêm trọng tại group {url}: {e}")

        print(f"🏁 Hoàn thành! Đã thu thập/cập nhật tổng cộng {total_collected} bài viết.")
        await browser.close()
        client.close()

if __name__ == "__main__":
    asyncio.run(scrape_groups())
