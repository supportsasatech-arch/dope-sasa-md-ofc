import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'emailwriter',
  description: 'Write professional emails',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📧 Usage: .emailwriter subject: meeting, purpose: scheduling' });
    const response = await groqChat([
      { role: 'system', content: 'Write a professional email based on user input.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `📧 *Email Draft:*\n${response}` });
  }
};
