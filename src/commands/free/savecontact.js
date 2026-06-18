export default {
  name: 'savecontact',
  description: 'Save a contact',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📇 Usage: .savecontact 9477xxxxxxx Name' });
    const [number, ...nameParts] = args;
    const name = nameParts.join(' ');
    if (!name) return sock.sendMessage(chatId, { text: '❌ Please provide a name.' });
    const jid = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
    await sock.sendMessage(chatId, {
      contacts: { displayName: name, contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:+${number}\nEND:VCARD` }] }
    });
    await sock.sendMessage(chatId, { text: `✅ Contact saved: ${name}` });
  }
};
