export default {
  name: 'autoreact',
  description: 'Toggle auto reaction in group',
  async execute(sock, msg, args, { user, chatId }) {
    const newState = !user.settings.autoreact;
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.autoreact': newState } });
    await sock.sendMessage(chatId, { text: `🔁 Auto react ${newState ? 'enabled' : 'disabled'}.` });
  }
};
