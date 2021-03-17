import { Schema, model } from 'mongoose'

const ModerationSchema = new Schema({
  guildID: { type: String, required: true },
  number: { type: Number, required: true },
  info: {
    member: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, required: false, default: 'none' },
    moderator: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  log_message: {
    channel: { type: String, required: true },
    message: { type: String, required: true }
  }
})

export default model('guilds.moderation', ModerationSchema)
