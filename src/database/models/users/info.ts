import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  owner: { type: Boolean, default: false },
  blacklisted: { type: Boolean, default: false }
});

export default model('users.info', UserSchema);
