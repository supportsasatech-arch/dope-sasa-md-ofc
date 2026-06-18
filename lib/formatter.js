export function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export function formatSriLankaTime(date = new Date()) {
  return date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });
}
