import mongoose from 'mongoose';

const premiumSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  plan: {
    type: String,
    enum: ['weekly', 'monthly', 'lifetime'],
    default: 'monthly'
  },
  activatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Auto-remove expired entries (optional index for TTL, but we handle expiry in commands)
premiumSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Premium', premiumSchema);
