import User from '../../../database/models/User.js';

export default {
  name: 'anticall',
  description: 'Toggle anti-call protection',
  async execute(sock, msg, args, { user, chatId }) {
    const newState = !user.settings.anticall;
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.anticall': newState } });
    await sock.sendMessage(chatId, { text: `📵 Anti-call ${newState ? 'enabled' : 'disabled'}.` });
  }
};
