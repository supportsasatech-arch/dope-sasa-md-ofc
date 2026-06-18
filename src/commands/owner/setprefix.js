import Settings from '../../../database/models/Settings.js';

export default {
  name: 'setprefix',
  description: 'Change command prefix',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🔣 Usage: .setprefix #' });
    const prefix = args[0];
    await Settings.findOneAndUpdate({ key: 'prefix' }, { value: prefix }, { upsert: true });
    process.env.BOT_PREFIX = prefix;
    await sock.sendMessage(chatId, { text: `✅ Prefix changed to "${prefix}"` });
  }
};
