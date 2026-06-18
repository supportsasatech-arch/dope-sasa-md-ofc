import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'coverletter',
  description: 'Write a cover letter',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📝 Usage: .coverletter job title' });
    const response = await groqChat([
      { role: 'system', content: 'Write a tailored cover letter.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `📝 *Cover Letter:*\n${response}` });
  }
};
