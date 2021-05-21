
import { APIGuildMember, APIMessage, Snowflake, APIUser, APIGuildInteraction, APIInteractionGuildMember, MessageFlags, APIInteractionApplicationCommandCallbackData } from 'discord-api-types'
import { CachedGuild, Embed, MessagesResource, MessageTypes, PermissionsUtils } from 'discord-rose'
import { bits } from 'discord-rose/dist/utils/Permissions'

import Worker from './TeranoWorker'

import { LanguageString } from '../lang'

import { SlashCommand } from './SlashHandler'
import FormData from 'form-data'

/**
 * Context holding all information about a ran command and utility functions
 */
export class SlashContext {
  /**
   * Worker
   */
  public worker: Worker
  /**
   * Command options object
   */
  public command: SlashCommand
  /**
   * The interaction which called the command
   */
  public interaction: APIGuildInteraction
  /**
   * Whether or not the bot has already responded
   */
  public responded?: boolean

  /**
   * The Slash Command Context
   * @param opts Options
   */
  constructor (opts: { worker: Worker, interaction: APIGuildInteraction, command: SlashCommand }) {
    this.interaction = opts.interaction
    this.worker = opts.worker
    this.command = opts.command
  }

  /**
   * Author of the message
   */
  get user (): APIUser {
    return this.member.user
  }

  /**
   * The real ID because this is how its gonna go
   */
  get id (): Snowflake {
    return this.interaction.guild_id
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
  get guild (): CachedGuild {
    return this.worker.guilds.get(this.interaction.guild_id) as CachedGuild
  }

  /**
   * Member who sent the message
   */
  get member (): APIInteractionGuildMember {
    return this.interaction.member
  }

  /**
   * Bot's memeber within the guild
   */
  get me (): APIGuildMember {
    return this.worker.selfMember.get(this.interaction.guild_id) as APIGuildMember
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
  async send (data: MessageTypes, ephermal = false): Promise<null> {
    const message = MessagesResource._formMessage(data, true) as APIInteractionApplicationCommandCallbackData
    if (ephermal) message.flags = MessageFlags.EPHEMERAL

    if (!this.responded) {
      this.responded = true

      return await this.worker.api.interactions.callback(this.interaction.id, this.interaction.token, {
        type: 4,
        data: message
      })
    }

    await this.worker.api.webhooks.editMessage(this.worker.user.id, this.interaction.token, '@original', data)

    return null
  }

  /**
   * Sends a message to the user who ran the command
   * @param data Data for message
   */
  async dm (data: MessageTypes): Promise<APIMessage> {
    return await this.worker.api.users.dm(this.user.id, data)
  }

  /**
   * Sends a file to the same channel
   * @param file File buffer
   * @param extra Extra message options
   * @returns
   */
  async sendFile (file: { name: string, buffer: Buffer }, extra?: MessageTypes): Promise<null> {
    if (!this.responded) {
      this.responded = true

      return await this.worker.api.interactions.callbackFile(this.interaction.id, this.interaction.token, file)
    }

    const formData = new FormData()
    formData.append('file', file.buffer, file.name)

    return await this.worker.api.request('PATCH', `/webhooks/${this.worker.user.id}/${this.interaction.token}/messages/@original`, {
      body: formData,
      headers: formData.getHeaders(),
      parser: _ => _
    })
  }

  /**
   * Starts typing in the channel
   */
  async thinking (): Promise<null> {
    if (this.responded) return null
    this.responded = true
    return await this.worker.api.interactions.callback(this.interaction.id, this.interaction.token, {
      type: 5
    })
  }

  /**
   * Makes an embed to send
   * @example
   * ctx.embed
   *   .title('Hello')
   *   .send()
   */
  get embed (): Embed {
    return new Embed(async (embed, ephermal) => {
      return (await this.send(embed, ephermal)) as any as APIMessage
    })
  }

  /**
   * Whether or not the running user has a certain permission
   * @param perms Permission to test
   * @returns
   */
  hasPerms (perms: keyof typeof bits): boolean {
    return PermissionsUtils.has(Number(this.member.permissions), perms)
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
      roleList: this.worker.guildRoles.get(this.guild.id)
    }), perms)
  }
}
