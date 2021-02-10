import { Schema, model } from 'mongoose';

const LevelSchema = new Schema({
  guildID: { type: String, required: true }, // Guild ID
  userID: { type: String, required: true }, // User ID
  xp: { type: String, default: '0' }, // 1 | 2 | 3...
  level: { type: Number, default: 0 }, // Level will never be greater than double, right?
})

export default model('users.levels', LevelSchema);

// Math.floor(100 + 5 / 6 * data.level * (2 * data.level * data.level + 27 * data.level + 91))