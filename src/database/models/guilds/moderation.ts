import { Schema, model } from 'mongoose';

const ModerationSchema = new Schema({
  guildID: { type: String, required: true }, // Guild ID
  number: { type: Number, required: true }, // 1 | 2 | 3...
  info: {
    member: { type: String, required: true }, // User ID
    action: { type: String, required: true }, // WARN | MUTE | BAN
    reason: { type: String, required: true }, // String why
    moderator: { type: String, required: true }, // User ID
    timestamp: { type: Date, required: true } // Date.now()
  },
  log_message: { type: String, required: true }
});

// type reason = 'WARN' | 'MUTE' | 'BAN' | 'TEMPBAN'

export default model('guilds.moderation', ModerationSchema);
