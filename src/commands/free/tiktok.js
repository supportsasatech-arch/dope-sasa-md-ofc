import axios from 'axios';

export default {
  name: 'tiktok',
  description: 'Download TikTok video',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🎵 Usage: .tiktok <video_url>' });
    const url = args[0];
    const res = await axios.get(`https://api.vihangayt.me/downloader/tiktok?url=${encodeURIComponent(url)}`);
    const vidUrl = res.data.data.video;
    await sock.sendMessage(chatId, { video: { url: vidUrl }, caption: '🎵 TikTok' });
  }
};
