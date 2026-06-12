export function parsePostContent(text) {
  const result = {
    title: 'Tuyển giao lưu cầu lông',
    location: 'Không xác định',
    time: 'Liên hệ',
    date: null,
    slots: 'Không rõ',
    contact: 'Không rõ',
    level: 'Không yêu cầu',
    price: null,
    gender: null,
    playType: null,
    posterName: null,
    rawText: text,
  };

  // Lọc bỏ các dòng metadata: tên người, timestamp, Like/Reply/Share/View...
  // Bỏ qua các dòng UI Facebook: reactions, comments, shares, author labels...
  const uiNoisePatterns = [
    /^(Like|Reply|Share|View|Follow|Write|See more|Người theo dõi|Active|PUBLIC GROUP|Tất cả cảm xúc|Thích|Bình luận|Chia sẻ|Xem thêm bình luận|Tác giả|Bạn nào|đi nhắn|mình nha|All reactions|Most relevant|Newest|Top|Recent|Write a comment)$/i,
    /^\d+(m|h|d|w|phút|ph|giờ|ngày)\s*$/i, // timestamp đứng một mình
    /^(Top contributor|All-star contributor|Rising contributor|Contributor)\s*$/i,
    /^·$/,
    /^(Facebook Member|Thành viên|Hội viên|Member)$/i,
    /^\d{1,2}$/, // số đứng một mình (reaction counts: 1, 4, etc.)
    /^(Thích|Bình luận|Chia sẻ|Like|Comment|Share)$/i,
    /^(Tác giả|Author|Người đăng|Posted by)$/i,
    /^(Bạn nào đi nhắn|Bạn nào|đi nhắn)/i,
    /^(Xem thêm|See more|Xem thêm bình luận)$/i,
    /^(Tất cả cảm xúc|All reactions|Cảm xúc)$/i,
    /^(NEWBIE|TB|TBY|Y\+|Y-|TB\+|TB-|TBK)$/i, // level tags đứng một mình
    /^(Không xác định|Không rõ|Liên hệ|Có slot)$/i, // giá trị mặc định đứng một mình
    /^(Nam|Nữ|Nam\/Nữ|Đơn|Đôi|Doi|Don)$/i, // gender/type tags đứng một mình
    /^\d{1,2}[kK]$/i, // giá tiền đứng một mình (35k, 50k...)
    /^(Sân\s+[A-Za-zÀ-ỹ\s]+)$/i, // tên sân đứng một mình (đã lấy ở location)
    /^(Slot:\s*\d+|Slot:\s*Có slot|Slot:\s*Không rõ)$/i,
    /^(Trình độ:\s*.+)$/i,
  ];
  const cleanLines = text.split('\n').filter(l => {
    const t = l.trim();
    if (!t || t === '·') return false;
    if (uiNoisePatterns.some(p => p.test(t))) return false;
    // Bỏ dòng quá ngắn (1-2 ký tự) và không phải nội dung bài
    if (t.length <= 2 && !/\d{1,2}[\/\-\.]\d{1,2}/.test(t)) return false;
    return true;
  });
  const cleanText = cleanLines.join('\n');

  // --- Poster Name ---
  result.posterName = extractPosterName(text, cleanLines);

  // --- Title ---
  for (const line of cleanLines) {
    const clean = line.replace(/\s*\.\.\.\s*See more.*$/i, '').trim();
    if (/^(Tuyển|TUYỂN|Tìm|TÌM|GÓC|Come|Alo|PUBLIC|CLB|Chiều|Tối|Sáng)/i.test(clean) && clean.length > 5 && clean.length < 130) {
      result.title = clean;
      break;
    }
  }
  if (result.title === 'Tuyển giao lưu cầu lông') {
    for (const line of cleanLines) {
      if (line.includes('cầu lông') || line.includes('giao lưu')) {
        result.title = line.replace(/\s*\.\.\.\s*See more.*$/i, '').trim();
        break;
      }
    }
  }

  // --- Location ---
  const locPatterns = [
    /Sân\s*:\s*([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ0-9\s\-\.\,\(\)\/]{1,50}?)(?:\n|$|,|\.{3}|See more)/i,
    /Sân\s+(?!max\s*\d|sẵn\s*\d)([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ0-9\s\-\.\,\(\)\/]{1,50}?)(?:\n|$|,|\.{3}|See more)/i,
  ];
  for (const pat of locPatterns) {
    const m = cleanText.match(pat);
    if (m) {
      let locName = m[1].trim().replace(/\s*max\s+\d.*$/i, '').trim();
      if (locName.length >= 2) {
        result.location = 'Sân ' + locName;
        break;
      }
    }
  }

  // --- Time ---
  const realTimePatterns = [
    /(\d{1,2}[hH]\d{2}\s*[-–]\s*\d{1,2}[hH]\d{2})/,
    /(\d{1,2}[hH]\d{2}\s*[-–]\s*\d{1,2}[hH])/,
    /(?:ca\s+|đánh\s+|từ\s+)(\d{1,2}[hH]\s*[-–]\s*\d{1,2}[hH])/i,
    /(\d{1,2}[:\.]\d{2}\s*[-–]\s*\d{1,2}[:\.]\d{2})/,
    /(\d{1,2}[hH]\s*[-–]\s*\d{1,2}[hH]\d{0,2})/,
  ];
  for (const pat of realTimePatterns) {
    const m = cleanText.match(pat);
    if (m) {
      result.time = m[1].trim().replace(/[-–]/g, '-');
      break;
    }
  }

  // --- Date ---
  const datePatterns = [
    /(?:thứ\s*\w+\s*[\(\[]?\s*)(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?)\s*[\)\]]?/i,
    /(?:\(|\b)(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?)(?:\)|\b)/,
  ];
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m && m[1]) { result.date = m[1].trim(); break; }
  }
  if (!result.date && /(?:tối\s+)?mai|ngày\s+mai/i.test(text)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    result.date = `${d.getDate()}/${d.getMonth() + 1}`;
  }

  // --- Slots ---
  const slotPatterns = [
    /tuyển\s*(?:thêm\s*)?(\d+)\s*slot/i,
    /cần\s*(?:thêm\s*)?(\d+)\s*(?:người|bạn|ace)/i,
    /còn\s*(\d+)\s*(?:slot|chỗ)/i,
    /tìm\s*(\d+)\s*slot/i,
    /sẵn\s*(\d+)\s*(?:nam|nữ|người)/i,
    /thiếu\s*(\d+)/i,
  ];
  for (const pat of slotPatterns) {
    const m = text.match(pat);
    if (m) { result.slots = m[1]; break; }
  }
  if (result.slots === 'Không rõ') {
    if (/\b(cần|tuyển|tìm|thiếu)\b/i.test(text)) result.slots = 'Có slot';
  }

  // --- Level ---
  const levelIdx = cleanLines.findIndex(l => /trình\s*(độ|trinh|do)/i.test(l));
  if (levelIdx >= 0) {
    const line = cleanLines[levelIdx];
    let levelStr = '';
    const inlineMatch = line.match(/trình\s*(?:độ|trinh|do)\s*[:\-]?\s*(.+)/i);
    if (inlineMatch && inlineMatch[1].trim().length < 50) {
      levelStr = inlineMatch[1].trim();
    } else if (levelIdx + 1 < cleanLines.length) {
      levelStr = cleanLines[levelIdx + 1].trim();
    }
    if (levelStr) {
      const part = levelStr.split(/[,;]/)[0].trim();
      if (part && part.length < 40) result.level = part;
    }
  }
  if (result.level === 'Không yêu cầu') {
    const lvlMatch = text.match(/\b(Newbie|Y[\+\-]?|TBY[\+\-]*|TB[\-\+]*K?|TBK[\+\-]*)\b/gi);
    if (lvlMatch) {
      result.level = [...new Set(lvlMatch.map(x => x.toUpperCase()))].join(', ');
    }
  }

  // --- Price ---
  const priceMatch = text.match(/phí\s*[:\-]?\s*(chia\s+đều|free|miễn\s*phí)/i);
  if (priceMatch) {
    result.price = 'Chia đều';
  } else {
    const priceK = text.match(/(\d{2,4})\s*[kK](?:\s*vnđ|\s*đồng)?/i);
    if (priceK) result.price = priceK[1] + 'k';
  }
  const malePrice = text.match(/nam[\s:]*(\d{2,4})\s*[kK]/i);
  const femalePrice = text.match(/nữ[\s:]*(\d{2,4})\s*[kK]/i);
  if (malePrice || femalePrice) {
    result.priceBreakdown = {
      male: malePrice ? malePrice[1] + 'k' : undefined,
      female: femalePrice ? femalePrice[1] + 'k' : undefined,
    };
  }

  // --- Gender ---
  const genderMatch = cleanText.match(/(?:ace\s+)?(?:slot\s+)?(nam|nữ|nam[\/\-]nữ)/i);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    result.gender = g === 'nữ' ? 'Nữ' : g.includes('/') || g.includes('-') ? 'Nam/Nữ' : 'Nam';
  }

  // --- Play Type ---
  const typeMatch = cleanText.match(/(đánh\s*đơn|đánh\s*đôi)/i);
  if (typeMatch) {
    result.playType = typeMatch[1].toLowerCase().replace('đánh ', '');
  }

  // --- Contact ---
  const phoneMatch = text.match(/(0\d{9}|0\d{1,s}\d{3}\s\d{3}\s\d{3}|\+84\d{9})/);
  if (phoneMatch) result.contact = phoneMatch[0];

  return result;
}

// --- Trích xuất tên người đăng ---
export function extractPosterName(text, cleanLines) {
  // Pattern 1: Dòng đầu tiên có thể là tên (trước timestamp hoặc metadata)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Bỏ các dòng metadata
  const metadataPatterns = [
    /^(Like|Reply|Share|View|Follow|Write|See more|Người theo dõi|Active|PUBLIC GROUP|Top contributor|All-star contributor|Rising contributor)$/i,
    /^\d+(m|h|d|w|phút|ph)\s*$/i,
    /^·$/,
    /^(Facebook Member|Thành viên|Hội viên)$/i,
  ];

  const contentLines = lines.filter(l => !metadataPatterns.some(p => p.test(l)));

  if (contentLines.length === 0) return null;

  // Pattern 2: Tên thường có dạng "Họ Tên" hoặc "Tên" ở đầu bài
  // Bỏ qua các dòng bắt đầu bằng keyword bài đăng
  const titleKeywords = /^(Tuyển|TUYỂN|Tìm|TÌM|GÓC|Come|Alo|PUBLIC|CLB|Chiều|Tối|Sáng|Host|Có sân|đánh)/i;

  for (const line of contentLines) {
    // Bỏ dòng quá ngắn hoặc quá dài
    if (line.length < 2 || line.length > 60) continue;
    // Bỏ dòng có chứa số điện thoại
    if (/\d{9,}/.test(line)) continue;
    // Bỏ dòng có keyword bài đăng
    if (titleKeywords.test(line)) continue;
    // Bỏ dòng có emoji nhiều (thường là nội dung bài)
    const emojiCount = (line.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 3) continue;
    // Tên người thường viết hoa chữ cái đầu hoặc toàn chữ hoa
    // Hoặc có dạng "Họ Tên" (2-4 từ, mỗi từ 2-15 ký tự)
    const namePattern = /^([A-ZÀ-Ỹ][a-zà-ỹ]*\s*){1,4}$/;
    if (namePattern.test(line) && line.split(/\s+/).length >= 2) {
      return line;
    }
    // Tên viết hoa toàn bộ: "NGUYỄN VĂN A"
    if (/^[A-ZÀ-Ỹ\s]{3,30}$/.test(line) && line.split(/\s+/).length >= 2) {
      return line;
    }
  }

  // Pattern 3: Tìm trong metadata "posted by" hoặc "bởi"
  const postedByMatch = text.match(/(?:đăng\s+bởi|posted\s+by|người\s+đăng)\s*[:\-]?\s*([A-Za-zÀ-ỹ\s]{2,30})/i);
  if (postedByMatch) return postedByMatch[1].trim();

  return null;
}

// --- Kiểm tra độ đầy đủ thông tin ---
export function isPostComplete(parsed) {
  const requiredFields = ['location', 'level', 'time'];
  const missing = requiredFields.filter(f => {
    const val = parsed[f];
    return !val || val === 'Không xác định' || val === 'Không rõ' || val === 'Liên hệ';
  });
  return missing.length === 0;
}

// --- Kiểm tra ngày bài viết có phải hôm nay hoặc tương lai ---
export function isPostDateValid(dateStr) {
  if (!dateStr) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse dd/mm hoặc dd/mm/yyyy
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length < 2) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parts[2] ? parseInt(parts[2], 10) : today.getFullYear();
  if (year < 100) year += 2000;

  const postDate = new Date(year, month, day);
  postDate.setHours(0, 0, 0, 0);

  return postDate >= today;
}

// --- Parse thời gian tương đối của Facebook thành ngày DD/MM/YYYY ---
export function parseFBTimestampToDate(timestampText) {
  if (!timestampText) return null;
  const now = new Date();
  const lower = timestampText.toLowerCase();

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // 1. "vừa xong" (just now) -> hôm nay
  if (lower.includes('vừa xong') || lower.includes('just now')) {
    return formatDate(now);
  }

  // 2. "\d+ phút" hoặc "\d+ giờ" hoặc "\d+h" hoặc "\d+m" -> hôm nay
  if (lower.includes('phút') || lower.includes('giờ') || lower.includes('hour') || lower.includes('minute') || /\b\d+[hm]\b/.test(lower)) {
    return formatDate(now);
  }

  // 3. "hôm qua" (yesterday) -> hôm qua
  if (lower.includes('hôm qua') || lower.includes('yesterday')) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return formatDate(yesterday);
  }

  // 4. "\d+ ngày" hoặc "\d+d" (days ago)
  const dayMatch = lower.match(/(\d+)\s*(ngày|day|d)/);
  if (dayMatch) {
    const diffDays = parseInt(dayMatch[1], 10);
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - diffDays);
    return formatDate(pastDate);
  }

  // 5. "\d+ tháng \d+" hoặc "\d+ thg \d+" hoặc "\d+ june" v.v.
  const monthMatch = lower.match(/(\d+)\s+(tháng|thg|june|july|august|september|october|november|december|january|february|march|april|may)\s+(\d+)/i);
  if (monthMatch) {
    const day = parseInt(monthMatch[1], 10);
    const monthWord = monthMatch[2].toLowerCase();
    let year = now.getFullYear();

    let monthNum = now.getMonth();
    if (monthWord.includes('tháng') || monthWord.includes('thg')) {
      monthNum = parseInt(monthMatch[3], 10) - 1;
    } else {
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const foundIdx = months.findIndex(m => monthWord.startsWith(m));
      if (foundIdx !== -1) monthNum = foundIdx;
    }

    const parsedDate = new Date(year, monthNum, day);
    return formatDate(parsedDate);
  }

  // Fallback về ngày hôm nay
  return formatDate(now);
}
