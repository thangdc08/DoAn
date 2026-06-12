export const scraperStatus = {
  status: 'idle', // 'idle' | 'scraping'
  logs: [
    `[${new Date().toLocaleTimeString('vi-VN')}] Hệ thống Facebook Scraper sẵn sàng.`
  ],
  addLog(msg) {
    const formatted = `[${new Date().toLocaleTimeString('vi-VN')}] ${msg}`;
    this.logs.push(formatted);
    process.stdout.write(msg + '\n');
    if (this.logs.length > 500) {
      this.logs.shift();
    }
  },
  setStatus(newStatus) {
    this.status = newStatus;
  },
  clearLogs() {
    this.logs = [];
  }
};
