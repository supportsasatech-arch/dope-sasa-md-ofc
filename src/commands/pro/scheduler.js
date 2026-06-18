import cron from 'node-cron';
const reminders = new Map();

export default {
  name: 'scheduler',
  description: 'Set a reminder (one-time)',
  async execute(sock, msg, args, { chatId, user, sender }) {
    if (args.length < 2) return sock.sendMessage(chatId, { text: '⏰ Usage: .scheduler 30s message (or 10m, 1h)' });
    const [duration, ...msgParts] = args;
    const time = parseDuration(duration);
    if (!time) return sock.sendMessage(chatId, { text: '❌ Invalid duration. Examples: 30s, 10m, 1h' });
    const messageText = msgParts.join(' ');
    const job = setTimeout(async () => {
      await sock.sendMessage(sender, { text: `⏰ Reminder: ${messageText}` });
      reminders.delete(user.jid);
    }, time);
    reminders.set(user.jid, job);
    await sock.sendMessage(chatId, { text: `⏰ Reminder set for ${duration}.` });
  }
};

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h)$/);
  if (!match) return null;
  const val = parseInt(match[1]);
  const unit = match[2];
  if (unit === 's') return val * 1000;
  if (unit === 'm') return val * 60000;
  if (unit === 'h') return val * 3600000;
  return null;
}
