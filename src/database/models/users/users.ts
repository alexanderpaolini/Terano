import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: { type: String, required: true }, // User ID
  owner: { type: Boolean, required: true }, // is owner
  blacklisted: { type: Boolean, required: false, default: false } // is blacklisted
})

export default model('users', UserSchema);
