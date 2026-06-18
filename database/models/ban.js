import mongoose from 'mongoose';

const banSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  reason: String,
  bannedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ban', banSchema);
