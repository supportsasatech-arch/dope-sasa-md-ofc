import axios from 'axios';

export default {
  name: 'youtube',
  description: 'Download YouTube video (link only)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '▶️ Usage: .youtube <url>' });
    const url = args[0];
    // Using a free API endpoint
    const res = await axios.get(`https://api.download-youtube.mp4.lat/video?url=${encodeURIComponent(url)}`);
    await sock.sendMessage(chatId, { video: { url: res.data.url }, caption: '▶️ YouTube Video' });
  }
};
