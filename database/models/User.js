import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  name: String,
  premium: { type: Boolean, default: false },
  premiumExpiry: Date,
  settings: {
    statusviews: { type: Boolean, default: true },
    autoreply: { type: Boolean, default: false },
    anticall: { type: Boolean, default: true },
    autoreact: { type: Boolean, default: false },
    alwaysonline: { type: Boolean, default: true },
    autostatuslike: { type: Boolean, default: true },
    autostatusseen: { type: Boolean, default: true },
    welcome: { type: Boolean, default: false },
    goodbye: { type: Boolean, default: false },
    antilink: { type: Boolean, default: false },
    antibadword: { type: Boolean, default: false },
    ai: { type: Boolean, default: true }
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  balance: { type: Number, default: 0 },
  lastDaily: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
