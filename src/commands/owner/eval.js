export default {
  name: 'eval',
  description: 'Evaluate JavaScript code',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return;
    const code = args.join(' ');
    try {
      let result = eval(code);
      if (typeof result !== 'string') result = require('util').inspect(result);
      await sock.sendMessage(chatId, { text: `✅ *Result:*\n\`\`\`${result}\`\`\`` });
    } catch (e) {
      await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}` });
    }
  }
};
