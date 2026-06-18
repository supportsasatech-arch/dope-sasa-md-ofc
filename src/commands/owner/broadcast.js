import User from '../../../database/models/User.js';

export default {
  name: 'broadcast',
  description: 'Broadcast to all users',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📢 Usage: .broadcast Hello everyone!' });
    const message = args.join(' ');
    const allUsers = await User.find({}).select('jid');
    let sent = 0;
    for (const u of allUsers) {
      try {
        await sock.sendMessage(u.jid, { text: `📢 *Announcement:*\n${message}` });
        sent++;
      } catch {}
    }
    await sock.sendMessage(chatId, { text: `✅ Sent to ${sent} users.` });
  }
};
