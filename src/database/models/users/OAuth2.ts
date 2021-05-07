import { Schema, model } from 'mongoose'

const OAuth2Schema = new Schema({
  id: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  bearer: { type: String, required: true, unique: true },
  avatar: { type: String, required: false, default: 'https://cdn.discordapp.com/embed/avatars/1.png' },
  email: { type: String, required: false }
})

export default model('users.oauth2', OAuth2Schema)
