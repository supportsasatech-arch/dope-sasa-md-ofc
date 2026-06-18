import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'resume',
  description: 'Create resume bullet points',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📄 Usage: .resume software engineer 5 years' });
    const response = await groqChat([
      { role: 'system', content: 'Generate professional resume bullet points.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `📄 *Resume Points:*\n${response}` });
  }
};
