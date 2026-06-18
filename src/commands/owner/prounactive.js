import Premium from '../../../database/models/Premium.js';

export default {
  name: 'prounactive',
  description: 'Deactivate premium',
  async execute(sock, msg, args, { chatId }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(chatId, { text: '❌ Mention user.' });
    await Premium.deleteOne({ jid: mentioned });
    await User.findOneAndUpdate({ jid: mentioned }, { premium: false, premiumExpiry: null });
    await sock.sendMessage(chatId, { text: `❌ Premium removed from @${mentioned.split('@')[0]}` });
  }
};
