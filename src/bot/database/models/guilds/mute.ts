import { Schema, model } from 'mongoose';

const MuteSchema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  timestamp: { type: String, required: true },
});

export default model('guilds.mutes', MuteSchema);
