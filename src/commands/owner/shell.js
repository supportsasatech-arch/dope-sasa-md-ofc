import { exec } from 'child_process';

export default {
  name: 'shell',
  description: 'Execute terminal command',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return;
    const command = args.join(' ');
    exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
      let output = stdout || stderr || error?.message;
      output = output.substring(0, 2000);
      await sock.sendMessage(chatId, { text: `🖥️ *Shell Output:*\n\`\`\`${output}\`\`\`` });
    });
  }
};
