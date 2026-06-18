import Premium from '../../../database/models/Premium.js';

export default {
  name: 'proactive',
  description: 'Activate premium for user',
  async execute(sock, msg, args, { chatId }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(chatId, { text: '❌ Mention user.' });
    await Premium.findOneAndUpdate({ jid: mentioned }, { jid: mentioned, plan: 'monthly', expiresAt: new Date(Date.now() + 30*24*60*60*1000) }, { upsert: true });
    await User.findOneAndUpdate({ jid: mentioned }, { premium: true, premiumExpiry: new Date(Date.now() + 30*24*60*60*1000) });
    await sock.sendMessage(chatId, { text: `🌟 Premium activated for @${mentioned.split('@')[0]}` });
  }
};
