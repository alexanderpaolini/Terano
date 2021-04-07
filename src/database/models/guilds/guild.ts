import { Schema, model } from 'mongoose'

const GuildSchema = new Schema({
  id: { type: String, required: true, unique: true },
  options: {
    prefix: { type: String, default: 't!' },
    embeds: { type: Boolean, default: true },
    no_permissions: { type: Boolean, default: true },
    lang: { type: String, default: 'en-US' }
  },
  level: {
    cooldown: { type: String, default: 15 },
    xp_multplier: { type: Number, default: 1 },
    send_level_message: { type: Boolean, default: false },
    level_message: { type: String, default: 'You are now level {{level}}!' },
    default_color: { type: String, default: '#07bb5b' },
    level_roles: { type: Array, default: [] }
  },
  moderation: {
    log_channel: { type: String, default: 'none' },
    mute_role: { type: String, default: 'none' },
    auto_role: { type: Array, default: [] }
  }
})

export default model('guilds', GuildSchema)
