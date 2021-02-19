import Monitor from "../lib/Monitor";

export default class PrefixMonitor extends Monitor {
  async run(msg: any) {
    if(!msg.content || !msg.guild_id) return;

    if (await this.worker.db.userDB.getBlacklist(msg.author.id)) return;
    const prefix = await this.worker.db.guildDB.getPrefix(msg.guild_id);

    const embed = {
      color: this.worker.colors.GREEN,
      description: `This guild's prefix is: **${prefix}**`
    };

    this.worker.api.messages.send(msg.channel_id, { embed: embed });
    return;
  }

  async restrictions(msg: any) {
    if (msg.content && msg.guild_id && msg.content.replace(/[<@!>]/g, '') === this.worker.user.id) return true;
    return false;
  }
}
