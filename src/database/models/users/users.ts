import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: { type: String, required: true }, // User ID
  owner: { type: Boolean, required: true } // is owner
})

export default model('users', UserSchema);
