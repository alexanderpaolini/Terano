import Monitor from '../structures/Monitor'

import { APIMessage } from 'discord-api-types'

export default class PrefixMonitor extends Monitor {
  async run (msg: APIMessage): Promise<void> {
    if (!msg.guild_id) return
    const prefix = await this.worker.db.guildDB.getPrefix(msg.guild_id)

    void await this.worker.api.messages.send(msg.channel_id, {
      embed: {
        color: this.worker.colors.GREEN,
        description: await this.worker.langs.getString(msg.guild_id ?? 'dm', 'PREFIX_CURRENT', prefix)
      }
    }).catch(() => { })
  }

  async restrictions (msg: APIMessage): Promise<boolean> {
    if (!msg.guild_id) return false
    return msg.content as (string | null) !== null &&
      msg.guild_id as (string | null) !== null &&
      msg.content.replace(/[<@!>]/g, '') === this.worker.user.id &&
      !(await this.worker.db.userDB.getBlacklist(msg.author.id))
  }
}
