
import { APIMessage, Snowflake } from 'discord-api-types'
import { CommandContext } from 'discord-rose'
import { getAvatar } from '../../utils'

export default class CMDCTX extends CommandContext {
  flags: any
  invokeCooldown?: () => void

  /**
   * Get whether or not a guild sends embeds
   */
  public async getEmbeds (): Promise<boolean> {
    return await this.worker.db.guildDB.getEmbeds(this.getID)
  }

  /**
   * The real ID because this is how its gonna go
   */
  get getID (): Snowflake {
    return this.guild?.id ?? this.message.author.id
  }

  /**
   * Se nd a normal message
   * @param color The color of the embed
   * @param response The message to respond
   * @param embed Force embed
   */
  async normalResponse (color: number, response: string, embed?: boolean): Promise<APIMessage | null> {
    const e = await this.getEmbeds()

    if (this.flags.s || this.flags.silent) return null

    if (e && !embed && !this.flags.noembed) {
      const url = getAvatar(this.message.author)
      return await this.embed
        .author(this.message.author.username + ' | ' + this.command.name, url)
        .description(response)
        .footer('Developed by MILLION#1321')
        .color(color)
        .timestamp()
        .send(true)
        .then(x => x)
        .catch(() => null)
    } else {
      return this.reply(response)
        .then(x => x)
        .catch(() => null)
    }
  }

  /**
   * Send a very small embed
   * @param color The color of the embed
   * @param response The message of the embed
   * @param embed Force embed
   */
  async codeResponse (color: number, response: string, lang: string = 'js', embed?: boolean): Promise<APIMessage | null> {
    const e = await this.getEmbeds()

    if (this.flags.silent || this.flags.s) return null

    if (e && !embed && !this.flags.noembed) {
      return await this.embed
        .description(`\`\`\`${lang}\n${response}\`\`\``)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(() => null)
    } else {
      return this.reply(`\`\`\`${lang}\n${response}\`\`\``)
        .then((x) => x)
        .catch(() => null)
    }
  }

  /**
   * Send a very small embed
   * @param color The color of the embed
   * @param response The message of the embed
   * @param embed Force embed
   */
  async tinyResponse (color: number, response: string, embed?: boolean): Promise<APIMessage | null> {
    const e = await this.getEmbeds()

    if (this.flags.silent || this.flags.s) return null

    if (e && !embed && !this.flags.noembed) {
      return await this.embed
        .author(response)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(() => null)
    } else {
      return this.reply(response)
        .then(x => x)
        .catch(() => null)
    }
  }

  /**
   * Send a smaller embed
   * @param color The color of the embed
   * @param response The message
   * @param embed Force embed
   */
  async smallResponse (color: number, response: string, embed?: boolean): Promise<APIMessage | null> {
    const e = await this.getEmbeds()

    if (this.flags.s || this.flags.silent) return null

    if (e && !embed && !this.flags.noembed) {
      const url = getAvatar(this.message.author)
      return await this.embed
        .author(this.message.author.username + ' | ' + this.command.name, url)
        .description(response)
        .color(color)
        .send(true)
        .then(x => x)
        .catch(() => null)
    } else {
      return this.reply(response)
        .then(x => x)
        .catch(() => null)
    }
  }

  /**
   * Await a response to a message
   * @param filter Filter to check before resolving
   * @param timeout How long to wait
   */
  async awaitResponse (filter: (m: APIMessage) => {} = () => true, timeout: number = 15000): Promise<APIMessage> {
    return await new Promise((resolve, reject) => {
      const func = (m: APIMessage): void => {
        if (!filter(m)) return
        resolve(m)
        this.worker.off('MESSAGE_CREATE', func)
      }

      this.worker.setMaxListeners(this.worker.getMaxListeners() + 1)
      this.worker.on('MESSAGE_CREATE', func)

      setTimeout(() => {
        this.worker.off('MESSAGE_CREATE', func)
        this.worker.setMaxListeners(this.worker.getMaxListeners() - 1)
        reject(new Error('Response timeout exceeded'))
      }, timeout)
    })
  }

  /**
   * Get the language string
   * @param name The name of the string
   * @param args A replacement string
   */
  async lang (name: string, ...args: string[]): Promise<string> {
    return await this.worker.langs.getString(this.getID, name, ...args)
  }
}