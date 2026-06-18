import axios from 'axios';

export default {
  name: 'anime',
  description: 'Random anime image',
  async execute(sock, msg, args, { chatId }) {
    const res = await axios.get('https://api.waifu.pics/sfw/waifu');
    await sock.sendMessage(chatId, { image: { url: res.data.url }, caption: '🌸 Random Anime' });
  }
};
