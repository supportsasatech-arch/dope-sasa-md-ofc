import Settings from '../../../database/models/Settings.js';

export default {
  name: 'setfooter',
  description: 'Set bot footer',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📌 Usage: .setfooter new footer text' });
    const footer = args.join(' ');
    await Settings.findOneAndUpdate({ key: 'bot_footer' }, { value: footer }, { upsert: true });
    process.env.BOT_FOOTER = footer;
    await sock.sendMessage(chatId, { text: '✅ Footer updated.' });
  }
};
