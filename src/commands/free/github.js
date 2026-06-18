import axios from 'axios';

export default {
  name: 'github',
  description: 'GitHub user/repo info',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🐙 Usage: .github username' });
    const user = args[0];
    const res = await axios.get(`https://api.github.com/users/${user}`);
    const data = res.data;
    await sock.sendMessage(chatId, { text: `🐱 *${data.login}*\n👥 ${data.followers} followers\n📦 ${data.public_repos} repos\n🔗 ${data.html_url}` });
  }
};
