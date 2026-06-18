import axios from 'axios';

export default {
  name: 'wallpaper',
  description: 'Get HD wallpaper',
  async execute(sock, msg, args, { chatId }) {
    const query = args.join(' ') || 'nature';
    const res = await axios.get(`https://api.unsplash.com/photos/random?query=${query}&client_id=UNSPLASH_ACCESS_KEY`);
    const imgUrl = res.data.urls.regular;
    await sock.sendMessage(chatId, { image: { url: imgUrl }, caption: `🖼️ ${res.data.alt_description || query}` });
  }
};
