
import { APIMessage, Snowflake } from 'discord-api-types'
import { CommandContext } from 'discord-rose'
import { getAvatar } from '../../utils'

import { LanguageString } from '../lang'

interface RespondOptions {
  mention?: boolean
  embed?: boolean
  reply?: boolean
  error?: boolean
  color?: number
}

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
   * Get the language string
   * @param name The name of the string
   * @param args A replacement string
   */
  async lang (name: LanguageString, ...args: string[]): Promise<string> {
    return await this.worker.langs.getString(this.getID, name, ...args)
  }

  /**
   * Respond in a nice format
   * @param message What to respond
   */
  async respond (name: LanguageString, options: RespondOptions = {}, ...args: string[]): Promise<APIMessage | null> {
    if (this.flags.s) return null

    const message = await this.lang(name, ...args)

    options.embed = options.embed === undefined ? !!await this.worker.db.guildDB.getEmbeds(this.getID) : options.embed

    if (!options.embed || this.flags.noembed || !this.myPerms('embed')) {
      return (await this.send({ content: message })
        .catch(() => undefined)) ?? null
    }

    options.error = options.error === undefined ? this.flags.error : options.error
    options.reply = options.reply === undefined ? this.flags.reply : options.reply
    options.mention = options.mention === undefined ? this.flags.mention : options.mention
    options.color = options.color ?? (options.error ? this.worker.colors.RED : this.worker.colors.GREEN)

    if (this.flags.noreply) options.reply = false
    if (this.flags.nomention) options.mention = false

    const cmd = ` | ${String(await this.lang(`CMD_${this.command.locale}_NAME` as LanguageString))}`

    const response = await this.embed
      .author(this.message.member?.nick ? this.message.member.nick + cmd : `${this.message.author.username}` + cmd, getAvatar(this.message.author))
      .description(message)
      .color(options.color ?? (options.error ? this.worker.colors.RED : this.worker.colors.GREEN))
      .send(options.reply, !!options.mention)
      .catch(() => undefined)

    return response ?? null
  }
}
