import TeranoWorker from "../lib/Worker";

export default class LevelMonitor {
  cooldown: Set<string>;

  constructor(public worker: TeranoWorker) {
    this.cooldown = new Set();
    worker.on('MESSAGE_CREATE', this.run.bind(this));
    worker.on('MESSAGE_UPDATE', this.run.bind(this));
  }

  async run(message: any) {
    if (!message?.author?.id || message.author.bot || !message.guild_id || this.cooldown.has(message.guild_id + message.author.id)) return;

    if (await this.worker.db.userDB.getBlacklist(message.author.id)) return;

    const guildDoc = await this.worker.db.guildDB.getGuild(message.guild_id);
    if (!guildDoc) {
      await this.worker.db.guildDB.createGuild(message.guild_id);
      return;
    }

    const userDoc = await this.worker.db.userDB.getLevel(message.author.id, message.guild_id);

    let xp = Number(userDoc.xp);
    xp += (Math.floor(Math.random() * 8) + 8) * guildDoc.options.level.xp_rate;

    if (xp > this.xpFromLevel(userDoc.level)) {
      userDoc.level++;
      userDoc.xp = String(xp - Number(userDoc.xp));

      if (guildDoc.options.level.send_message) this.sendUpdateMessage(message, userDoc.level, guildDoc);
    } else userDoc.xp = String(xp);

    await this.worker.db.userDB.updateLevel(userDoc);

    this.cooldown.add(message.guild_id + message.author.id);
    setTimeout(() => { this.cooldown.delete(message.guild_id + message.author.id); }, guildDoc.options.level.cooldown * 1000);

    return;
  }

  async sendUpdateMessage(message: any, level: number, guildDoc: any) {
    const guild = this.worker.guilds.get(message.guild_id);

    // TODO: Fix this later
    // const member = this.worker.members.get(message.guild_id).get(message.author.id);
    const member: any = {};

    const msg = guildDoc.options.level.level_message.replace(/{{(.+?)}}/g, (match: string) => {
      switch (match.slice(2, -2)) {
        case "tag": return `${message.author.username}#${message.author.discriminator}`;

        case "user":
        case "username": return message.author.username;

        case "nick":
        case "nickname": return member.nick || message.author.username;

        case "server":
        case "guild": return guild.name;

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

    await this.worker.api.messages.send(message.channel_id, { embed: embed }, {
      channel_id: message.channel_id, guild_id: message.guild_id, message_id: message.id
    }).catch(err => this.worker.logger.error(err.toString()));
  }

  xpFromLevel(level: number) {
    return Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91));
  }
}
