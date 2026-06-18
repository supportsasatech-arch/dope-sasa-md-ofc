import axios from 'axios';

export default {
  name: 'quote',
  description: 'Random inspirational quote',
  async execute(sock, msg, args, { chatId }) {
    const res = await axios.get('https://api.quotable.io/random');
    await sock.sendMessage(chatId, { text: `💬 *"${res.data.content}"*\n— ${res.data.author}` });
  }
};
