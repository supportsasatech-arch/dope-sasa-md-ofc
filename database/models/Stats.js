import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  totalCommands: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  uptime: Date,
});

export default mongoose.model('Stats', statsSchema);
