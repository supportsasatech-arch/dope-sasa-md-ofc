import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Database
import connectDB from './database/index.js';

// WhatsApp
import { connectToWhatsApp } from './lib/baileys.js';

// Web Routes
import homeRoute from './routes/home.js';
import pairRoute from './routes/pair.js';
import howtoRoute from './routes/howto.js';
import contactRoute from './routes/contact.js';
import termsRoute from './routes/terms.js';
import faqRoute from './routes/faq.js';

// For stats
import User from './database/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));     // serves CSS, JS, images
app.use('/assets', express.static(path.join(__dirname, 'web'))); // alias

// Web Panel Routes
app.use('/', homeRoute);              // GET /
app.use('/pair', pairRoute);          // POST /pair/start-qr, /pair/start-paircode, GET /pair/status/:id
app.use('/how-to-connect', howtoRoute);
app.use('/contact', contactRoute);
app.use('/terms', termsRoute);
app.use('/faq', faqRoute);

// API: Bot Stats (used by the home page)
app.get('/api/stats', async (req, res) => {
  try {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const formatted = `${days}d ${hours}h ${minutes}m`;

    const userCount = await User.countDocuments();
    const status = global.botStartTime ? 'Online' : 'Connecting...';
    res.json({ uptime: formatted, users: userCount, status });
  } catch {
    res.json({ uptime: '0d 0h 0m', users: 0, status: 'Offline' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Start everything
async function start() {
  // 1. MongoDB
  await connectDB();

  // 2. Start WhatsApp connection (does not block)
  connectToWhatsApp().catch(err => console.error('❌ WhatsApp connection error:', err));

  // 3. Start HTTP server
  app.listen(PORT, () => {
    console.log(`\n🌐 Web Panel running on http://localhost:${PORT}`);
    console.log(`🤖 DOPE SASA MD is initialising...\n`);
  });
}

start();
