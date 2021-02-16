import { Schema, model } from 'mongoose';

const GuildSchema = new Schema({
  id: { type: String, required: true, unique: true },
  prefix: { type: String, default: 't!' },
  options: {
    embeds: { type: Boolean, default: false },
    no_permissions: { type: Boolean, default: true },
    level: {
      xp_rate: { type: Number, default: 1 },
      send_message: { type: Boolean, default: true },
      default_color: { type: String, default: '#07bb5b' },
      level_message: { type: String, default: 'You are now level {{level}}!' },
      cooldown: { type: String, default: 15 }
    },
    moderation: {
      log_channel: { type: String, default: 'none' },
      mute_role: { type: String, default: 'none' }
    }
  }
});

export default model('guilds', GuildSchema);
