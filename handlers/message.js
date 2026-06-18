import { isJidGroup, getContentType, downloadContentFromMessage } from '@whiskeysockets/baileys';
import { loadCommands } from './command.js';
import User from '../database/models/User.js';
import Ban from '../database/models/Ban.js';
import { handleAutoStatus, handleAntiCall, handleAutoReact } from './events.js';
import { getCurrentSLTime } from '../lib/time.js';

const prefix = process.env.BOT_PREFIX || '.';

export async function handleMessages(sock, { messages }) {
  for (const msg of messages) {
    if (!msg.message || msg.key.fromMe) continue;

    const sender = msg.key.participant || msg.key.remoteJid;
    const chatId = msg.key.remoteJid;
    const isGroup = isJidGroup(chatId);
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    // Anti-call
    if (msg.message?.protocolMessage?.type === 1) {
      await handleAntiCall(sock, msg);
      continue;
    }

    // Status updates (auto seen, like)
    if (chatId === 'status@broadcast') {
      await handleAutoStatus(sock, msg);
      continue;
    }

    // Auto react
    if (text && isGroup) {
      await handleAutoReact(sock, msg);
    }

    // Ban check
    const banned = await Ban.findOne({ jid: sender });
    if (banned) continue;

    // User registration
    const user = await User.findOneAndUpdate(
      { jid: sender },
      { $setOnInsert: { jid: sender, name: msg.pushName || 'User' } },
      { upsert: true, new: true }
    );

    // Command handling
    if (!text.startsWith(prefix)) continue;
    const [cmd, ...args] = text.slice(prefix.length).trim().split(/ +/);
    const commandName = cmd.toLowerCase();

    const commands = await loadCommands();
    const command = commands.get(commandName);
    if (!command) continue;

    // Owner check for owner commands
    if (command.category === 'owner') {
      const ownerJid = process.env.OWNER_NUMBER + '@s.whatsapp.net';
      if (sender !== ownerJid) {
        await sock.sendMessage(chatId, { text: '❌ Owner only command!' });
        continue;
      }
    }

    // Premium check for pro commands
    if (command.category === 'pro') {
      const isPremium = user.premium && (!user.premiumExpiry || user.premiumExpiry > new Date());
      if (!isPremium) {
        await sock.sendMessage(chatId, { text: '🔒 This command is for premium users only!' });
        continue;
      }
    }

    try {
      await command.execute(sock, msg, args, { user, isGroup, chatId, sender });
    } catch (err) {
      console.error(`Command ${commandName} error:`, err);
      await sock.sendMessage(chatId, { text: '⚠️ An error occurred while executing this command.' });
    }
  }
}
