import axios from 'axios';

export default {
  name: 'lyrics',
  description: 'Fetch song lyrics',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🎵 Usage: .lyrics shape of you' });
    const query = args.join(' ');
    const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
    await sock.sendMessage(chatId, { text: `🎶 *Lyrics for "${query}":*\n${res.data.lyrics.substring(0, 1500)}` });
  }
};
