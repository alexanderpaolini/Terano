import { Schema, model } from 'mongoose';

const SettingsSchema = new Schema({
  id: { type: String, required: true, unique: true }, // User ID
  level: {
    tag: { type: String, default: '' },
    color: { type: String, default: '' },
    picture: { type: String, default: '' },
  }
});

export default model('users.settings', SettingsSchema);
