import TeranoWorker from "../lib/Worker";

export default class PrefixMonitor {
  regex: RegExp;
  constructor(public worker: TeranoWorker) {
    this.regex = /[<@!>]/g;
    worker.on('MESSAGE_CREATE', this.run.bind(this));
    worker.on('MESSAGE_UPDATE', this.run.bind(this));
  }

  async run(message: any) {
    if (message.content && message.guild_id && message.content.replace(this.regex, '') === this.worker.user.id) {

      if (await this.worker.db.userDB.getBlacklist(message.author.id)) return;
      const prefix = (await this.worker.db.guildDB.getGuild(message.guild_id))?.prefix || 't!';

      const embed = {
        color: this.worker.colors.GREEN,
        description: `This guild's prefix is: **${prefix}**`
      };

      this.worker.api.messages.send(message.channel_id, { embed: embed });
      return;
    }
  }
}
