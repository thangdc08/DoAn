export const parsePostContent = (text) => {
    const result = {
        title: 'Tuyển giao lưu cầu lông',
        location: 'Không xác định',
        time: 'Liên hệ',
        slots: 'Không rõ',
        contact: 'Không rõ',
        rawText: text
    };

    // Tách địa điểm
    const locationMatch = text.match(/(Sân\s+[\w\s]+)|(Quận\s+\d+|Quận\s+[A-Z]\d+|Huyện\s+[\w\s]+|TP\.\s+[\w\s]+)/i);
    if (locationMatch) result.location = locationMatch[0];

    // Tách thời gian
    const timeMatch = text.match(/(\d{1,2}h\s*-\s*\d{1,2}h)|(\d{1,2}[:.]\d{2}\s*(sáng|chiều|tối|đêm))/i);
    if (timeMatch) result.time = timeMatch[0];

    // Tách số slot
    const slotMatch = text.match(/(cần\s*(\d+)\s*người)|(tìm\s*(\d+)\s*slot)|(còn\s*(\d+)\s*chỗ)/i);
    if (slotMatch) result.slots = slotMatch[2] || slotMatch[4] || slotMatch[6] || 'Có slot';

    // Tách số điện thoại
    const phoneMatch = text.match(/(0\d{9}|0\d{1}\s\d{3}\s\d{3}\s\d{3})/);
    if (phoneMatch) result.contact = phoneMatch[0];

    return result;
};
