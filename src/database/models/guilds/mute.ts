import { Schema, model } from 'mongoose';

const MuteSchema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  reason: { type: String, required: false, default: 'none' },
  timestamp: { type: String, required: true },
  moderator: { type: String, required: true },
});

export default model('guilds.mutes', MuteSchema);
