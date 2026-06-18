import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'protranslate',
  description: 'Accurate translation with context',
  async execute(sock, msg, args, { chatId }) {
    if (args.length < 2) return sock.sendMessage(chatId, { text: '🌐 Usage: .protranslate si Hello' });
    const lang = args[0];
    const text = args.slice(1).join(' ');
    const response = await groqChat([
      { role: 'system', content: `Translate the following text to ${lang}. Only output translation.` },
      { role: 'user', content: text }
    ]);
    await sock.sendMessage(chatId, { text: `🔤 *Translation (${lang}):*\n${response}` });
  }
};
