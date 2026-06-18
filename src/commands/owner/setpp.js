import Jimp from 'jimp';

export default {
  name: 'setpp',
  description: 'Set bot profile picture',
  async execute(sock, msg, args, { chatId }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
    if (!imageMsg) return sock.sendMessage(chatId, { text: '🖼️ Reply to an image to set as profile picture.' });
    const stream = await downloadContentFromMessage(imageMsg, 'image');
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    const image = await Jimp.read(buffer);
    image.resize(640, 640);
    const newBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    await sock.updateProfilePicture(sock.user.id, newBuffer);
    await sock.sendMessage(chatId, { text: '✅ Profile picture updated.' });
  }
};
