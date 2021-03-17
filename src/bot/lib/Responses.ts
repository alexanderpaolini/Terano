import { CommandContext } from 'discord-rose/dist/typings/lib'
import { APIMessage } from 'discord-api-types'
import { getAvatar } from '../../utils'

// TODO: not do this
export default class Responses { // eslint-disable-line @typescript-eslint/no-extraneous-class
  /**
   * Get whether or not a guild sends embeds
   * @param ctx The Command Context
   */
  public static async getEmbed (ctx: CommandContext): Promise<boolean> {
    return await ctx.worker.db.guildDB.getEmbeds(ctx.guild.id)
  }

  /**
   * Send a normal message
   * @param ctx The command context
   * @param color The color of the embed
   * @param response The message to respond
   * @param embed Force embed
   */
  public static async normal (ctx: CommandContext, color: number, response: string, embed?: boolean): Promise<APIMessage | boolean> {
    const e = await this.getEmbed(ctx)

    if (ctx.flags.s || ctx.flags.silent) return true

    if (e && !embed && !ctx.flags.noembed) {
      const url = getAvatar(ctx.message.author)
      return await ctx.embed
        .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
        .description(response)
        .footer('Developed by MILLION#1321')
        .color(color)
        .timestamp()
        .send(true)
        .then(x => x)
        .catch(x => false)
    } else {
      return ctx.reply(response)
        .then(x => x)
        .catch(x => false)
    }
  }

  /**
   * Send a very small embed
   * @param ctx The Command Context
   * @param color The color of the embed
   * @param response The message of the embed
   * @param embed Force embed
   */
  public static async code (ctx: CommandContext, color: number, response: string, lang: string = 'js', embed?: boolean): Promise<APIMessage | boolean> {
    const e = await this.getEmbed(ctx)

    if (ctx.flags.silent || ctx.flags.s) return true

    if (e && !embed && !ctx.flags.noembed) {
      return await ctx.embed
        .description(`\`\`\`${lang}\n${response}\`\`\``)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(x => false)
    } else {
      return ctx.reply(`\`\`\`${lang}\n${response}\`\`\``)
        .then(x => x)
        .catch(x => false)
    }
  }

  /**
   * Send a very small embed
   * @param ctx The Command Context
   * @param color The color of the embed
   * @param response The message of the embed
   * @param embed Force embed
   */
  public static async tiny (ctx: CommandContext, color: number, response: string, embed?: boolean): Promise<APIMessage | boolean> {
    const e = await this.getEmbed(ctx)

    if (ctx.flags.silent || ctx.flags.s) return true

    if (e && !embed && !ctx.flags.noembed) {
      return await ctx.embed
        .author(response)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(x => false)
    } else {
      return ctx.reply(response)
        .then(x => x)
        .catch(x => false)
    }
  }

  /**
   * Send a smaller embed
   * @param ctx Command Context
   * @param color The color of the embed
   * @param response The message
   * @param embed Force embed
   */
  public static async small (ctx: CommandContext, color: number, response: string, embed?: boolean): Promise<APIMessage | boolean> {
    const e = await this.getEmbed(ctx)

    if (ctx.flags.s || ctx.flags.silent) return true

    if (e && !embed && !ctx.flags.noembed) {
      const url = getAvatar(ctx.message.author)
      return await ctx.embed
        .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
        .description(response)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(x => false)
    } else {
      return ctx.reply(response)
        .then(x => x)
        .catch(x => false)
    }
  }
}
