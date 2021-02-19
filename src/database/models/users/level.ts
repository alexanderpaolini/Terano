import { Schema, model } from 'mongoose';

const LevelSchema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  xp: { type: String, default: '0' },
  level: { type: Number, default: 0 },
});

export default model('users.levels', LevelSchema);
