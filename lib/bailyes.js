import pino from 'pino';
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import readline from 'readline';
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  proto
} from '@whiskeysockets/baileys';
import { getMongoSession } from './mongo.js';

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

let sock = null;
let connectionState = 'close';

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMongoAuthState();
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`🟢 Baileys version: ${version.join('.')}, isLatest: ${isLatest}`);

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['DOPE SASA MD', 'Chrome', '1.0.0'],
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: process.env.ALWAYS_ONLINE === 'true',
    getMessage: async (key) => {
      // you can implement message store if needed
      return { conversation: '' };
    }
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('🔲 QR Code received, please scan with WhatsApp');
      // QR will be displayed on web panel if needed
      global.qrCode = qr;
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;
      console.log(`⚠️ Connection closed. Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 5000);
      } else {
        console.log('❌ Logged out. Delete session and restart.');
        process.exit(1);
      }
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp');
      global.botStartTime = Date.now();
      connectionState = 'open';
      // Set presence to always online if enabled
      if (process.env.ALWAYS_ONLINE === 'true') {
        await sock.sendPresenceUpdate('available');
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Message handler import and listen
  const { handleMessages } = await import('../handlers/message.js');
  sock.ev.on('messages.upsert', async (m) => {
    await handleMessages(sock, m);
  });

  // Group participants update
  sock.ev.on('group-participants.update', async (ev) => {
    const { handleGroupUpdate } = await import('../handlers/events.js');
    await handleGroupUpdate(sock, ev);
  });

  return sock;
}

export function getSocket() {
  return sock;
}

// MongoDB Auth State
async function useMongoAuthState() {
  const collection = await getMongoSession();
  let creds = await collection.findOne({ _id: 'auth_state' });
  if (!creds) {
    creds = { _id: 'auth_state', state: {} };
    await collection.insertOne(creds);
  }

  const saveCreds = async (newCreds) => {
    await collection.updateOne(
      { _id: 'auth_state' },
      { $set: { state: newCreds } },
      { upsert: true }
    );
  };

  return {
    state: {
      creds: creds.state.creds || {},
      keys: creds.state.keys || {},
    },
    saveCreds,
  };
}
