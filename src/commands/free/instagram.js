import axios from 'axios';

export default {
  name: 'instagram',
  description: 'Download Instagram media',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📸 Usage: .instagram <post_url>' });
    const url = args[0];
    // Use a public Instagram download API (e.g., https://vihangayt.me/docs)
    const res = await axios.get(`https://api.vihangayt.me/downloader/instagram?url=${encodeURIComponent(url)}`);
    const data = res.data.data;
    if (data.media?.length) {
      for (const media of data.media) {
        await sock.sendMessage(chatId, { [media.type.includes('video') ? 'video' : 'image']: { url: media.url } });
      }
    } else {
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch.' });
    }
  }
};
