import express from 'express';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import pino from 'pino';
import { getMongoSession } from '../lib/mongo.js';

const router = express.Router();
const pairingSessions = new Map();

// Start QR pairing
router.post('/start-qr', async (req, res) => {
  try {
    const session = await createPairingSession();
    res.json({
      success: true,
      sessionId: session.sessionId,
      qrImage: session.data.qrImage || null,
      pairCode: session.data.pairCode || null,
      message: 'Scan QR code or wait for pair code'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start pair code pairing (with country code + number)
router.post('/start-paircode', async (req, res) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    if (!countryCode || !phoneNumber) throw new Error('Country code and phone number required.');
    const fullNumber = `${countryCode}${phoneNumber}`;

    const session = await createPairingSession(fullNumber); // triggers requestPairingCode
    res.json({
      success: true,
      sessionId: session.sessionId,
      pairCode: session.data.pairCode || null,
      message: 'Pair code generated. Enter it in WhatsApp.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check connection status
router.get('/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = pairingSessions.get(sessionId);
  if (!session) return res.json({ success: false, connected: false, message: 'Session expired' });
  res.json({ success: true, connected: session.data.connected });
});

// Helper: create a pairing session
async function createPairingSession(phoneNumber = null) {
  const sessionId = uuidv4();
  const collection = await getMongoSession();
  const { state, saveCreds } = await useTempMongoAuthState(collection, sessionId);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['DOPE SASA MD', 'Chrome', '2.0.0'],
    printQRInTerminal: false,
  });

  const sessionData = {
    sock,
    qrImage: null,
    pairCode: null,
    connected: false,
    credsSaved: false
  };
  pairingSessions.set(sessionId, sessionData);

  // If phone number provided, request pair code immediately
  if (phoneNumber) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        sessionData.pairCode = code;
      } catch (err) {
        console.error('Pair code request error:', err);
      }
    }, 1000);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;
    if (qr) {
      const qrBuffer = await QRCode.toBuffer(qr, { width: 300 });
      sessionData.qrImage = `data:image/png;base64,${qrBuffer.toString('base64')}`;
    }
    if (pairingCode) {
      sessionData.pairCode = pairingCode;
    }
    if (connection === 'open') {
      sessionData.connected = true;
      await saveCreds();
    }
    if (connection === 'close') {
      const shouldSave = lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
      if (sessionData.connected && !sessionData.credsSaved) {
        // Copy temporary auth state to main session
        const tempDoc = await collection.findOne({ _id: `auth_state_${sessionId}` });
        if (tempDoc) {
          await collection.updateOne(
            { _id: 'auth_state' },
            { $set: { state: tempDoc.state } },
            { upsert: true }
          );
          sessionData.credsSaved = true;
        }
      }
      sock.end();
      pairingSessions.delete(sessionId);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return { sessionId, data: sessionData };
}

async function useTempMongoAuthState(collection, sessionId) {
  let creds = await collection.findOne({ _id: `auth_state_${sessionId}` });
  if (!creds) {
    creds = { _id: `auth_state_${sessionId}`, state: {} };
    await collection.insertOne(creds);
  }
  const saveCreds = async (newCreds) => {
    await collection.updateOne(
      { _id: `auth_state_${sessionId}` },
      { $set: { state: newCreds } },
      { upsert: true }
    );
  };
  return {
    state: { creds: creds.state.creds || {}, keys: creds.state.keys || {} },
    saveCreds
  };
}

export default router;
