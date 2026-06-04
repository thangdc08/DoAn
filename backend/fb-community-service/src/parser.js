export function parsePostContent(text) {
  const result = {
    title: 'Tuyển giao lưu cầu lông',
    location: 'Không xác định',
    time: 'Liên hệ',
    slots: 'Không rõ',
    contact: 'Không rõ',
    level: 'Không yêu cầu',
    rawText: text,
  };

  // Lọc bỏ các dòng metadata: tên người, timestamp, "Like", "Reply", "View", "Follow", "Top contributor", "All-star"
  const cleanLines = text.split('\n').filter(l => {
    const t = l.trim();
    if (!t || t === '·') return false;
    if (/^(Like|Reply|Share|View|Follow|Write|See more|Người theo dõi|Active|PUBLIC GROUP)/i.test(t)) return false;
    if (/^\d+(m|h|d|w)\s*$/i.test(t)) return false; // timestamp "3m", "1h", "2d"
    if (/^(Top contributor|All-star contributor|Rising contributor)\s*$/i.test(t)) return false;
    if (/^Địa điểm\s*:/i.test(t)) return false;
    return true;
  });
  const cleanText = cleanLines.join('\n');

  // --- Title: dòng đầu có keyword ---
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

  // --- Location: "Sân X" — không bắt "Sân max: 8ng" vì max không phải tên sân ---
  // Pattern: Sân + tên (ít nhất 2 ký tự, không bắt đầu bằng số, không chứa "max" đứng ngay sau Sân)
  const locMatch = cleanText.match(/Sân\s+(?!max\s*\d|sẵn\s*\d)([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ0-9\s\-\.\(\)]{1,40}?)(?:\n|,|$|:|;|\.{3}|See more)/i);
  if (locMatch) {
    result.location = 'Sân ' + locMatch[1].trim();
  }
  // Fallback: Sân + tên ngắn (1-2 từ) ở đầu dòng
  if (result.location === 'Không xác định') {
    const shortLoc = cleanText.match(/^Sân\s+([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{1,25})$/im);
    if (shortLoc) result.location = 'Sân ' + shortLoc[1].trim();
  }

  // --- Time ---
  const timePatterns = [
    /(\d{1,2}h\d{2}\s*-\s*\d{1,2}h\d{2})/,
    /(\d{1,2}[:\.]\d{2}\s*-\s*\d{1,2}[:\.]\d{2})/,
    /(\d{1,2}h\s*-\s*\d{1,2}h)/,
    /(ca\s+\d{1,2}h\s*-\s*\d{1,2}h)/i,
    /(\d{1,2}\s*-\s*\d{1,2}h)/,
    /(\d{1,2}h(?:\s*-\s*\d{1,2}h)?)/,
  ];
  for (const pat of timePatterns) {
    const m = text.match(pat);
    if (m) { result.time = m[1].trim(); break; }
  }

  // --- Slots: bắt "tuyển X slot/người", "cần thêm X", "còn X slot", "sẵn X nam/nữ" ---
  const slotPatterns = [
    /tuyển\s*(?:thêm\s*)?(\d+)\s*slot/i,
    /cần\s*(?:thêm\s*)?(\d+)\s*(?:người|bạn)/i,
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
    if (/\b(cần|tuyển|tìm)\s*(thêm\s*)?\d/i.test(text)) result.slots = 'Có slot';
  }

  // --- Level: lấy dòng "Trình độ" hoặc "Trình" ---
  const levelLine = cleanLines.find(l => /trình\s*(độ|trinh|do)\s*$/i.test(l.trim().toLowerCase()));
  if (!levelLine) {
    // thử match dòng có "Trình :" hoặc "Trình độ" ở giữa
    const idx = cleanLines.findIndex(l => /trình\s*(độ|trinh|do)/i.test(l));
    if (idx >= 0) {
      const line = cleanLines[idx];
      const after = line.replace(/.*trình\s*(độ|trinh|do)\s*[\s:]*/i, '').trim();
      const part = after.split(/[,;]/)[0].trim();
      if (part && part.length < 30 && /[A-Za-zÀ-ỹ]/.test(part)) result.level = part;
    }
  } else {
    // dòng tiếp theo chứa trình độ
    const li = cleanLines.indexOf(levelLine);
    if (li >= 0 && li + 1 < cleanLines.length) {
      const next = cleanLines[li + 1].trim();
      const part = next.split(/[,;]/)[0].trim();
      if (part && part.length < 40) result.level = part;
    }
  }
  // Fallback: bắt TB, TBY, Y, Newbie trong text
  if (result.level === 'Không yêu cầu') {
    const lvlMatch = text.match(/\b(Newbie|Y[\+\-]?|TBY[\+\-]*|TB[\-\+]*K?|TBK[\-\+]*)\b/gi);
    if (lvlMatch) result.level = [...new Set(lvlMatch.map(x => x.toUpperCase()))].join(', ');
  }

  // --- Contact: số điện thoại ---
  const phoneMatch = text.match(/(0\d{9}|0\d{1}\s\d{3}\s\d{3}\s\d{3}|\+84\d{9})/);
  if (phoneMatch) result.contact = phoneMatch[0];

  return result;
}
