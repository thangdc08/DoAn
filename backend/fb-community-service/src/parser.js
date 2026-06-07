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
    rawText: text,
  };

  // Lọc bỏ các dòng metadata: tên người, timestamp, Like/Reply/Share/View...
  const cleanLines = text.split('\n').filter(l => {
    const t = l.trim();
    if (!t || t === '·') return false;
    if (/^(Like|Reply|Share|View|Follow|Write|See more|Người theo dõi|Active|PUBLIC GROUP)/i.test(t)) return false;
    if (/^\d+(m|h|d|w|phút|ph)\s*$/i.test(t)) return false; // timestamp đứng một mình: 3m, 1h, 4h, 10h
    if (/^(Top contributor|All-star contributor|Rising contributor)\s*$/i.test(t)) return false;
    if (/^Địa điểm\s*:/i.test(t)) return false;
    return true;
  });
  const cleanText = cleanLines.join('\n');

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

  // --- Location: hỗ trợ cả "Sân : tên" và "Sân tên" ---
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

  // --- Time: ưu tiên giờ đánh thật (có dấu -, dạng 22H30-0H30, 19h30-21h30...) ---
  const realTimePatterns = [
    /(\d{1,2}[hH]\d{2}\s*[-–]\s*\d{1,2}[hH]\d{2})/,           // 22H30-0H30
    /(\d{1,2}[hH]\d{2}\s*[-–]\s*\d{1,2}[hH])/,                  // 21h30-23h
    /(?:ca\s+|đánh\s+|từ\s+)(\d{1,2}[hH]\s*[-–]\s*\d{1,2}[hH])/i, // ca 21h30-23h30
    /(\d{1,2}[:\.]\d{2}\s*[-–]\s*\d{1,2}[:\.]\d{2})/,           // 22:00-24:00
    /(\d{1,2}[hH]\s*[-–]\s*\d{1,2}[hH]\d{0,2})/,                // 9h-11h
  ];
  for (const pat of realTimePatterns) {
    const m = cleanText.match(pat);
    if (m) {
      result.time = m[1].trim().replace(/[-–]/g, '-');
      break;
    }
  }

  // --- Date: bắt (dd/mm), dd/mm/yyyy, "thứ X (dd/mm)" ---
  const datePatterns = [
    /(?:thứ\s*\w+\s*[\(\[]?\s*)(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?)\s*[\)\]]?/i,
    /(?:\(|\b)(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?)(?:\)|\b)/,
  ];
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m && m[1]) { result.date = m[1].trim(); break; }
  }
  // Fallback: "tối mai" → ngày mai
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

  // --- Level: "Trình :" hoặc "Trình độ" ---
  const levelIdx = cleanLines.findIndex(l => /trình\s*(độ|trinh|do)/i.test(l));
  if (levelIdx >= 0) {
    const line = cleanLines[levelIdx];
    // "Trình : Y+, TBY..." hoặc dòng kế tiếp
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
  // Fallback: bắt level codes trong text
  if (result.level === 'Không yêu cầu') {
    const lvlMatch = text.match(/\b(Newbie|Y[\+\-]?|TBY[\+\-]*|TB[\-\+]*K?|TBK[\+\-]*)\b/gi);
    if (lvlMatch) {
      result.level = [...new Set(lvlMatch.map(x => x.toUpperCase()))].join(', ');
    }
  }

  // --- Price: "Phí: chia đều", "50k", "65k", "Nam 65k Nữ 50k" ---
  const priceMatch = text.match(/phí\s*[:\-]?\s*(chia\s+đều|free|miễn\s*phí)/i);
  if (priceMatch) {
    result.price = 'Chia đều';
  } else {
    const priceK = text.match(/(\d{2,4})\s*[kK](?:\s*vnđ|\s*đồng)?/i);
    if (priceK) result.price = priceK[1] + 'k';
  }
  // Parse gender-based prices: "Nam 65k Nữ 50k" or "💁Nam: 65k 💁‍♀️Nữ: 50k"
  const malePrice = text.match(/nam[\s:]*(\d{2,4})\s*[kK]/i);
  const femalePrice = text.match(/nữ[\s:]*(\d{2,4})\s*[kK]/i);
  if (malePrice || femalePrice) {
    result.priceBreakdown = {
      male: malePrice ? malePrice[1] + 'k' : undefined,
      female: femalePrice ? femalePrice[1] + 'k' : undefined,
    };
  }

  // --- Gender: "ace nam", "slot nữ", "nam/nữ", "nam-nữ" ---
  const genderMatch = cleanText.match(/(?:ace\s+)?(?:slot\s+)?(nam|nữ|nam[\/\-]nữ)/i);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    result.gender = g === 'nữ' ? 'Nữ' : g.includes('/') || g.includes('-') ? 'Nam/Nữ' : 'Nam';
  }

  // --- Play Type: "đánh đơn", "đánh đôi" ---
  const typeMatch = cleanText.match(/(đánh\s*đơn|đánh\s*đôi)/i);
  if (typeMatch) {
    result.playType = typeMatch[1].toLowerCase().replace('đánh ', '');
  }

  // --- Contact ---
  const phoneMatch = text.match(/(0\d{9}|0\d{1,s}\d{3}\s\d{3}\s\d{3}|\+84\d{9})/);
  if (phoneMatch) result.contact = phoneMatch[0];

  return result;
}
