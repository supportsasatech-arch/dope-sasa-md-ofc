/// Dope Sasage Code Ussn Nm Ep 🥰🙌"
import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'coder',
  description: 'AI code generator',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '💻 Usage: .coder python fibonacci' });
    const response = await groqChat([
      { role: 'system', content: 'You are a senior developer. Write clean, commented code.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `💻 *Code:*\n\`\`\`${response}\`\`\`` });
  }
};
