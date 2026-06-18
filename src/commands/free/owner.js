export default {
  name: 'owner',
  description: 'Get bot owner Details',
  async execute(sock, msg, args, { chatId }) {
    await sock.sendMessage(chatId, {
      contacts: {
        displayName: 'DOPE SASA',
        contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:DOPE SASA OWNER\nTEL;TYPE=CELL:+${process.env.OWNER_NUMBER}\nEND:VCARD` }]
      }
    });
  }
};
