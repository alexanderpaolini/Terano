
import { APIChannel, APIGuildMember, APIMessage, Snowflake, APIUser } from 'discord-api-types'
import { CachedGuild, Embed, Emoji, MessagesResource, MessageTypes, PermissionsUtils } from 'discord-rose'
import { bits } from 'discord-rose/dist/utils/Permissions'

import qs from 'querystring'
import fetch from 'node-fetch'

import Worker from './TeranoWorker'
import { CommandOptions } from './CommandHandler'

import { LanguageString } from '../lang'

import { getAvatar } from '../utils'

export interface RespondOptions {
  /**
   * Whether to mention or not
   * @default false
   */
  mention?: boolean
  /**
   * Whether to embed or not
   * @default true
   */
  embed?: boolean
  /**
   * Whether to reply or not
   * @default true
   */
  reply?: boolean
  /**
   * Whether or not it is an error
   * @default false
   */
  error?: boolean
  /**
   * The custom color to make it
   */
  color?: number
}

/**
 * Command Error.
 * Includes nonFatal for error handling
 */
export class CommandError extends Error {
  /**
   * Whether it is fatal or not
   */
  nonFatal?: boolean
}

/**
 * Context holding all information about a ran command and utility functions
 */
export class CommandContext {
  flags: any

  invokeCooldown!: () => void

  /**
   * Command arguments
   */
  public args: any[]
  /**
   * Worker
   */
  public worker: Worker
  /**
   * Message which command was ran with
   */
  public message: APIMessage
  /**
   * Command options object
   */
  public command: CommandOptions<any>
  /**
   * Prefix command was ran with
   */
  public prefix: string
  /**
   * Actual command that was ran (including possible aliases)
   */
  public ran: string

  constructor (opts: { worker: Worker, message: APIMessage, command: CommandOptions<any>, prefix: string, ran: string, args: string[] }) {
    this.worker = opts.worker
    this.message = opts.message
    this.command = opts.command
    this.prefix = opts.prefix
    this.ran = opts.ran
    this.args = opts.args
  }

  /**
   * Author of the message
   */
  get author (): APIUser {
    return this.message.author
  }

  /**
   * The real ID because this is how its gonna go
   */
  get id (): Snowflake {
    return this.guild?.id ?? this.message.author.id
  }

  /**
   * Get the language string
   * @param name The name of the string
   * @param args A replacement string
   */
  async lang (name: LanguageString, ...args: string[]): Promise<string> {
    return await this.worker.langs.getString(this.id, name, ...args)
  }

  /**
   * Guild where the message was sent
   */
  get guild (): CachedGuild | undefined {
    return this.worker.guilds.get(this.message.guild_id as Snowflake)
  }

  /**
   * Channel where the message was sent
   */
  get channel (): APIChannel | undefined {
    return this.worker.channels.get(this.message.channel_id)
  }

  /**
   * Member who sent the message
   */
  get member (): APIGuildMember {
    return Object.assign({ user: this.message.author }, this.message.member)
  }

  /**
   * Bot's memeber within the guild
   */
  get me (): APIGuildMember {
    return this.worker.selfMember.get(this.message.guild_id as Snowflake) as APIGuildMember
  }

  /**
   * Send an image from la API
   * @param image The image name
   * @param data data or something
   */
  async imageAPI (image: string, data: any): Promise<APIMessage | null> {
    const req = await fetch(`http://localhost:${this.worker.config.image_api.port}/images/${image}?${qs.stringify(data)}`)
    if (req.status !== 200) {
      return null
    }
    const buffer = await req.buffer()
    return await this.sendFile({ name: `${image}.png`, buffer })
  }

  /**
   * Replies to the invoking message
   * @param data Data for message
   * @param mention Whether or not to mention the user in the reply (defaults to false)
   * @returns Message sent
   */
  async reply (data: MessageTypes, mention = false): Promise<APIMessage> {
    if (!mention) {
      data = MessagesResource._formMessage(data)
      if (!data.allowed_mentions) data.allowed_mentions = {}
      data.allowed_mentions.replied_user = false
    }

    return await this.worker.api.messages.send(this.message.channel_id, data, {
      message_id: this.message.id,
      channel_id: this.message.channel_id,
      guild_id: this.message.guild_id
    })
  }

  /**
   * Get whether or not a guild sends embeds
   */
  public async getEmbeds (): Promise<boolean> {
    return await this.worker.db.guildDB.getEmbeds(this.id)
  }

  /**
   * Sends a message in the same channel as invoking message
   * @param data Data for message
   * @returns Message sent
   */
  async send (data: MessageTypes): Promise<APIMessage> {
    return await this.worker.api.messages.send(this.message.channel_id, data)
  }

  /**
   * React to the invoking command message
   * @param emoji ID of custom emoji or unicode emoji
   */
  async react (emoji: Emoji): Promise<never> {
    return await this.worker.api.messages.react(this.message.channel_id, this.message.id, emoji)
  }

  /**
   * Runs an error through sendback of commands.error
   * @param message Message of error
   */
  async error (message: string | Promise<string>): Promise<void> {
    const error = new CommandError(await message)

    error.nonFatal = true

    void this.worker.commands.errorFunction(this, error)
  }

  /**
   * Sends a message to the user who ran the command
   * @param data Data for message
   */
  async dm (data: MessageTypes): Promise<APIMessage> {
    return await this.worker.api.users.dm(this.message.author.id, data)
  }

  /**
   * Sends a file to the same channel
   * @param file File buffer
   * @param extra Extra message options
   * @returns
   */
  async sendFile (file: { name: string, buffer: Buffer }, extra?: MessageTypes): Promise<APIMessage> {
    return await this.worker.api.messages.sendFile(this.message.channel_id, file, extra)
  }

  /**
   * Starts typing in the channel
   */
  async typing (): Promise<null> {
    return await this.worker.api.channels.typing(this.message.channel_id)
  }

  /**
   * Deletes the invoking message
   */
  async delete (): Promise<never> {
    return await this.worker.api.messages.delete(this.message.channel_id, this.message.id)
  }

  /**
   * Makes an embed to send
   * @example
   * ctx.embed
   *   .title('Hello')
   *   .send()
   */
  get embed (): Embed {
    return new Embed(async (embed, reply, mention) => {
      if (reply) return await this.reply(embed, mention)
      else return await this.send(embed)
    })
  }

  /**
   * Whether or not the running user has a certain permission
   * @param perms Permission to test
   * @returns
   */
  hasPerms (perms: keyof typeof bits): boolean {
    if (!this.guild) throw new Error('Missing guild')

    return PermissionsUtils.has(PermissionsUtils.combine({
      guild: this.guild,
      member: this.member,
      overwrites: this.channel?.permission_overwrites,
      roleList: this.worker.guildRoles.get(this.guild.id)
    }), perms)
  }

  /**
   * Whether or not the bot user has a certain permission
   * @param perms Permission to test
   * @returns
   */
  myPerms (perms: keyof typeof bits): boolean {
    if (!this.guild) throw new Error()

    return PermissionsUtils.has(PermissionsUtils.combine({
      guild: this.guild,
      member: this.me,
      overwrites: this.channel?.permission_overwrites,
      roleList: this.worker.guildRoles.get(this.guild.id)
    }), perms)
  }

  /**
   * Respond in a nice way
   * @param name The lang
   * @param options The options
   * @param args stuff
   */
  async respond (name: LanguageString, options: RespondOptions = {}, ...args: string[]): Promise<APIMessage | null> {
    if (this.flags.s) return null

    const message = await this.lang(name, ...args)

    options.embed = options.embed === undefined ? !!await this.worker.db.guildDB.getEmbeds(this.id) : options.embed

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
