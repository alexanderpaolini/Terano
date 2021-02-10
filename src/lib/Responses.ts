import CommandContext from "../structures/CommandContext";

export default class Responses {
  public static async getEmbed(ctx: CommandContext) {
    const embed = (await ctx.worker.db.guildDB.getGuild(ctx.message.guild_id))?.options.embeds || true
    return embed
  }

  public static normal(ctx: CommandContext, color: number, response: string) {
    this.getEmbed(ctx).then(e => {
      try {
        if (e) {
          const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`
          ctx.embed
            .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
            .description(response)
            .footer('Developed by MILLION#1321')
            .color(color)
            .timestamp()
            .send(true);
        } else {
          ctx.reply(response)
        }
        return true;
      } catch (err) {
        return false;
      }
    })
  };

  public static tiny(ctx: CommandContext, color: number, response: string) {
    this.getEmbed(ctx).then(e => {
      try {
        if (e) {
          ctx.embed
            .description(`\`\`\`${response}\`\`\``)
            .color(color)
            .send(true);
        } else {
          ctx.reply(response)
        }
        return true;
      } catch (err) {
        return false;
      }
    })
  };

  public static small(ctx: CommandContext, color: number, response: string) {
    this.getEmbed(ctx).then(e => {
      try {
        if (e) {
          const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`
          ctx.embed
            .author(ctx.message.author.username + ' | ' + ctx.command.command, url)
            .description(response)
            .color(color)
            .send(true);
        } else {
          ctx.reply(response)
        }
        return true;
      } catch (err) {
        return false;
      }
    })
  };
}