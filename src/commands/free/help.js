export default {
  name: 'help',
  description: 'Get help for a command',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '❓ Usage: .help <command>' });
    const { loadCommands } = await import('../../../handlers/command.js');
    const commands = await loadCommands();
    const cmd = commands.get(args[0].toLowerCase());
    if (!cmd) return sock.sendMessage(chatId, { text: '❌ Command not found.' });
    await sock.sendMessage(chatId, { text: `📖 *${process.env.BOT_PREFIX}${cmd.name}*\n📝 ${cmd.description}\n📂 Category: ${cmd.category}` });
  }
};
