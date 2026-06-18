import axios from 'axios';

export default {
  name: 'facebook',
  description: 'Download Facebook video',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📘 Usage: .facebook <video_url>' });
    const url = args[0];
    const res = await axios.get(`https://api.vihangayt.me/downloader/facebook?url=${encodeURIComponent(url)}`);
    const hd = res.data.data.links['Download High Quality'];
    await sock.sendMessage(chatId, { video: { url: hd }, caption: '📘 Facebook Video' });
  }
};
