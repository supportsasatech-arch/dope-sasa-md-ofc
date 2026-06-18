import axios from 'axios';

export default {
  name: 'weather',
  description: 'Get weather for a city',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🌦️ Usage: .weather Colombo' });
    const city = args.join(' ');
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%w+%h`);
      await sock.sendMessage(chatId, { text: `🌤️ *${city}:* ${res.data}` });
    } catch {
      await sock.sendMessage(chatId, { text: '❌ City not found.' });
    }
  }
};
