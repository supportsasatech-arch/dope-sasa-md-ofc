import { loadCommands } from '../../../handlers/command.js';
import { formatUptime, formatSriLankaTime } from '../../../lib/formatter.js';

export default {
  name: 'menu',
  description: 'Show main menu',
  async execute(sock, msg, args, { user, chatId }) {
    const commands = await loadCommands();
    const freeCmds = [...commands.values()].filter(c => c.category === 'free');
    const proCmds = [...commands.values()].filter(c => c.category === 'pro');
    const ownerCmds = [...commands.values()].filter(c => c.category === 'owner');

    const menuText = `
╭━━━━━━━━━━━━━━━━━╮
┃  *${process.env.BOT_NAME || 'DOPE SASA MD'}*
┃  𝙱𝚢 𝙳𝙾𝙿𝙴 𝚂𝙰𝚂𝙰 𝙼𝙳
╰━━━━━━━━━━━━━━━━━╯

╭───❏ *User Info* ❏───
┃  👤 Name: ${msg.pushName}
┃  🌟 Premium: ${user.premium ? '✅ Active' : '❌ Inactive'}
┃  💰 Balance: ${user.balance || 0}
┃  ⚡ Level: ${user.level || 1}
╰─────────────────────

╭───❏ *Bot Stats* ❏───
┃  ⏱️ Uptime: ${formatUptime(process.uptime())}
┃  🕒 Sri Lanka Time: ${formatSriLankaTime()}
┃  📦 Total Cmds: ${commands.size}
┃  🆓 Free: ${freeCmds.length}
┃  🔒 Pro: ${proCmds.length}
┃  👑 Owner: ${ownerCmds.length}
┃  📡 Platform: Railway
┃  🟢 Node.js: ${process.version}
╰─────────────────────

╭───❏ *Free Commands* ❏───
${formatList(freeCmds)}
╭───❏ *Pro Commands* ❏───
${formatList(proCmds)}
╭───❏ *Owner Commands* ❏───
${formatList(ownerCmds)}

${process.env.BOT_FOOTER}`;

    await sock.sendMessage(chatId, {
      image: { url: process.env.BOT_IMAGE_URL },
      caption: menuText,
      footer: '© DOPE SASA MD',
    });
  }
};

function formatList(cmds) {
  return cmds.map(c => `│   ${process.env.BOT_PREFIX}${c.name} - ${c.description}`).join('\n');
}
