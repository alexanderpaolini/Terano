import { APIMessage } from "discord-api-types";
import Embed from "../lib/Embed";
import TeranoWorker from "../lib/Worker";

export default class PrefixMonitor {
  regex: RegExp;
  constructor(public worker: TeranoWorker) {
    this.regex = /[<@!>]/g
    worker.on('MESSAGE_CREATE', this.run.bind(this));
    worker.on('MESSAGE_UPDATE', this.run.bind(this));
  }

  async run(message: any) {
    if (message.content && message.guild_id && message.content.replace(this.regex, '') === this.worker.user.id) {
      const prefix = (await this.worker.db.guildDB.getGuild(message.guild_id))?.prefix || 't!';
      const embed = new Embed()
        .setColor('GREEN')
        .setDescription(`The current prefix is: **${prefix}**`)
        .obj;
      this.worker.api.messages.send(message.channel_id, { embed: embed });
      return;
    }
  }
}
