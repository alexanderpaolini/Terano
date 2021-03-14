import { Schema, model } from 'mongoose';

const VoteSchema = new Schema({
  id: { type: String, required: true, unique: true },
  total_votes: { type: Number, default: 1 },
  votes_worth: { type: Number, default: 1 },
  votes: { type: Array, default: [] }
});

export default model('users.votes', VoteSchema);
