export default {
  name: 'addpro',
  description: 'Add premium (by number)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '❌ Usage: .addpro 9477xxxxxxx' });
    const jid = args[0] + '@s.whatsapp.net';
    await Premium.findOneAndUpdate({ jid }, { jid, plan: 'monthly', expiresAt: new Date(Date.now() + 30*24*60*60*1000) }, { upsert: true });
    await User.findOneAndUpdate({ jid }, { premium: true, premiumExpiry: new Date(Date.now() + 30*24*60*60*1000) });
    await sock.sendMessage(chatId, { text: `✅ Premium added to ${args[0]}` });
  }
};
