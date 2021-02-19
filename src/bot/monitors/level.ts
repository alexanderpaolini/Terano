import { Snowflake } from "discord-api-types";
import Monitor from "../lib/Monitor";

export default class PrefixMonitor extends Monitor {
  cooldown = new Set();

  async run(message: any) {
    const guildDoc = await this.worker.db.guildDB.getGuild(message.guild_id);
    const userDoc = await this.worker.db.userDB.getLevel(message.author.id, message.guild_id);

    let xp = Number(userDoc.xp);
    xp += (Math.floor(Math.random() * 8) + 8) * guildDoc.level.xp_multplier;

    if (xp > this.xpFromLevel(userDoc.level)) {
      userDoc.level++;
      userDoc.xp = String(xp - Number(userDoc.xp));

      if (guildDoc.level.send_level_message) this.sendUpdateMessage(message, userDoc.level, guildDoc);
    } else userDoc.xp = String(xp);

    await this.worker.db.userDB.updateLevel(userDoc);

    this.cooldown.add(message.guild_id + message.author.id);
    setTimeout(() => { this.cooldown.delete(message.guild_id + message.author.id); }, guildDoc.level.cooldown * 1000);

    return;
  }

  async restrictions(msg: any) {
    if(!msg?.author?.id || msg.author.bot || !msg.guild_id || this.cooldown.has(msg.guild_id + msg.author.id)) return false;
    if (await this.worker.db.userDB.getBlacklist(msg.author.id)) return false;
    return true;
  }

  async sendUpdateMessage(message: any, level: number, guildDoc: GuildDoc) {
    const guild = this.worker.guilds.get(message.guild_id);

    // TODO: Fix this later
    // const member = this.worker.members.get(message.guild_id).get(message.author.id);
    const member: any = {};

    const msg = guildDoc.level.level_message.replace(/{{(.+?)}}/g, (match: string) => {
      switch (match.slice(2, -2)) {
        case "tag": return `${message.author.username}#${message.author.discriminator}`;

        case "user":
        case "username": return message.author.username;

        case "nick":
        case "nickname": return member.nick || message.author.username;

        case "server":
        case "guild": return guild!.name;

        case "lvl":
        case "level": return level;

        default: return match;
      }
    });

    const embed = {
      color: this.worker.colors.GREEN,
      author: {
        name: msg,
        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=128`,
      }
    };

    await this.worker.api.messages.send(message.channel_id as Snowflake, { embed: embed }).catch(err => this.worker.logger.error(err.toString()));
  }

  xpFromLevel(level: number) {
    return Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91));
  }
}
