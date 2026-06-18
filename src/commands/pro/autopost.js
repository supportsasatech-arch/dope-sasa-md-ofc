import User from '../../../database/models/User.js';
import cron from 'node-cron';
const schedules = new Map();

export default {
  name: 'autopost',
  description: 'Schedule auto status posts',
  async execute(sock, msg, args, { chatId, user }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📅 Usage: .autopost "text" 10:00' });
    const [text, time] = args.join(' ').split('"').filter(s => s.trim());
    if (!text || !time) return sock.sendMessage(chatId, { text: '❌ Format: .autopost "Hello" 10:00' });
    const [hour, minute] = time.trim().split(':');
    const cronExp = `${minute} ${hour} * * *`;
    if (schedules.has(user.jid)) schedules.get(user.jid).stop();
    const job = cron.schedule(cronExp, async () => {
      await sock.sendMessage('status@broadcast', { text });
    });
    schedules.set(user.jid, job);
    await sock.sendMessage(chatId, { text: `✅ Autopost scheduled daily at ${time}` });
  }
};
