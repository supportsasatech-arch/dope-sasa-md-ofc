import User from '../database/models/User.js';

export async function handleAutoStatus(sock, msg) {
  const settings = await User.findOne({ jid: msg.key.participant || msg.key.remoteJid });
  if (!settings) return;

  // Status seen
  if (settings.settings?.autostatusseen && msg.message?.protocolMessage?.type === 0) {
    // Send seen to status
    await sock.readMessages([msg.key]);
  }

  // Status like (send reaction)
  if (settings.settings?.autostatuslike && msg.message?.conversation) {
    await sock.sendMessage('status@broadcast', {
      react: { text: '😝', key: msg.key }
    });
  }
}

export async function handleAntiCall(sock, msg) {
  const caller = msg.key.remoteJid;
  // Send decline/reject
  await sock.sendMessage(caller, { text: '🚫 Calls are disabled on this number.' });
  // Optionally block
  // await sock.updateBlockStatus(caller, 'block');
}

export async function handleAutoReact(sock, msg) {
  // Simple random emoji react
  const emojis = ['❤️', '👍', '🔥','😢','🙌','🥹','🥰','😮', '😂'];
  const react = emojis[Math.floor(Math.random() * emojis.length)];
  await sock.sendMessage(msg.key.remoteJid, { react: { text: react, key: msg.key } });
}

export async function handleGroupUpdate(sock, { id, participants, action }) {
  // Welcome/Goodbye messages if enabled (to implement later)
}
