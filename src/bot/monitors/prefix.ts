import Monitor from '../structures/Monitor'

export default class PrefixMonitor extends Monitor {
  async run (msg: any): Promise<void> {
    const prefix = await this.worker.db.guildDB.getPrefix(msg.guild_id)

    void await this.worker.api.messages.send(msg.channel_id, {
      embed: {
        color: this.worker.colors.GREEN,
        description: `This guild's prefix is: **${prefix}**`
      }
    }).catch(() => { })
  }

  async restrictions (msg: any): Promise<boolean> {
    return msg.content as (string | null) !== null &&
      msg.guild_id as (string | null) !== null &&
      msg.content.replace(/[<@!>]/g, '') === this.worker.user.id &&
      !(await this.worker.db.userDB.getBlacklist(msg.author.id))
  }
}
