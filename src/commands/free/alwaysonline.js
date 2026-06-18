export default {
  name: 'alwaysonline',
  description: 'Toggle always online presence',
  async execute(sock, msg, args, { user, chatId }) {
    const newState = !user.settings.alwaysonline;
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.alwaysonline': newState } });
    if (newState) await sock.sendPresenceUpdate('available');
    else await sock.sendPresenceUpdate('unavailable');
    await sock.sendMessage(chatId, { text: `🟢 Always online ${newState ? 'on' : 'off'}.` });
  }
};
