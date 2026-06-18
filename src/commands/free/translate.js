import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'translate',
  description: 'Translate text (e.g., .translate en Hello)',
  async execute(sock, msg, args, { chatId }) {
    if (args.length < 2) return sock.sendMessage(chatId, { text: '🌐 Usage: .translate <lang_code> <text>' });
    const lang = args[0];
    const text = args.slice(1).join(' ');
    const response = await groqChat([
      { role: 'system', content: `You are a translator. Translate the user text to ${lang}. Only output the translation.` },
      { role: 'user', content: text }
    ]);
    await sock.sendMessage(chatId, { text: `🔤 *Translation (${lang}):*\n${response}` });
  }
};
