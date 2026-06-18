import axios from 'axios';

export default {
  name: 'shorturl',
  description: 'Shorten a URL',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🔗 Usage: .shorturl https://example.com' });
    const url = args[0];
    try {
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      await sock.sendMessage(chatId, { text: `🔗 Short URL: ${res.data}` });
    } catch {
      await sock.sendMessage(chatId, { text: '❌ Failed to shorten.' });
    }
  }
};
