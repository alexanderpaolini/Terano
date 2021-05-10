import { Schema, model } from 'mongoose'
import { Cache } from '@jpbberry/cache'

const guildSchema = new Schema({
  id: { type: String, required: true, unique: true },
  options: {
    prefix: { type: String, default: 't!' },
    embeds: { type: Boolean, default: true },
    no_permissions: { type: Boolean, default: true },
    lang: { type: String, default: 'en-US' }
  },
  level: {
    cooldown: { type: String, default: 15 },
    xp_multplier: { type: Number, default: 1 },
    send_level_message: { type: Boolean, default: false },
    level_message: { type: String, default: 'You are now level {{level}}!' },
    default_color: { type: String, default: '#07bb5b' },
    level_roles: { type: Array, default: [] }
  },
  moderation: {
    log_channel: { type: String, default: 'none' },
    mute_role: { type: String, default: 'none' },
    auto_role: { type: Array, default: [] }
  }
})

const guildModel = model('guilds', guildSchema)

const moderationSchema = new Schema({
  guildID: { type: String, required: true },
  number: { type: Number, required: true },
  info: {
    member: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, required: false, default: 'none' },
    moderator: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  log_message: {
    channel: { type: String, required: true },
    message: { type: String, required: true }
  }
})

const moderationModel = model('guilds.moderation', moderationSchema)

export default class GuildDB {
  /**
   * The Guilds in cache
   */
  guilds: Cache<string, GuildDoc> = new Cache(15 * 60 * 1000)

  /**
   * Get a guild doc from the cache/DB
   * @param id The ID of the guild
   */
  async getGuild (id: string): Promise<GuildDoc> {
    // Check the cache first
    const fromCache = this.guilds.get(id)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: GuildDoc = await guildModel.findOne({ id }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.guilds.set(id, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return await this.createGuild(id)
  }

  /**
   * Create the default guild doc
   * @param id The ID of the guild
   */
  async createGuild (id: string): Promise<GuildDoc> {
    await guildModel.create({ id })
    return await this.getGuild(id)
  }

  /**
   * Update a guild doc
   * @param doc The already-existing guild document
   */
  async updateGuild (doc: GuildDoc): Promise<GuildDoc> {
    this.guilds.set(doc.id, doc)
    return guildModel.findOneAndUpdate({ id: doc.id }, doc).lean() as unknown as GuildDoc
  }

  /**
   * Get a guild's prefix
   * @param id Guild ID
   */
  async getPrefix (id: string): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.options.prefix
  }

  /**
   * Set a guild's prefix
   * @param id Guild ID
   * @param prefix The new prefix
   */
  async setPrefix (id: string, prefix: string): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.options.prefix = prefix
    return await this.updateGuild(guildData)
  }

  /**
   * Get whether or not to send embeds
   * @param id Guild ID
   */
  async getEmbeds (id: string): Promise<boolean> {
    const guildData = await this.getGuild(id)
    return guildData.options.embeds
  }

  /**
   * Set whether or not to send embeds
   * @param id Guild ID
   * @param value Whether or not to send embeds
   */
  async setEmbeds (id: string, value: boolean): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.options.embeds = value
    return await this.updateGuild(guildData)
  }

  /**
   * Get whether or not to send the no-permissions message
   * @param id Guild ID
   */
  async getSendPermsMessage (id: string): Promise<boolean> {
    const guildData = await this.getGuild(id)
    return guildData.options.no_permissions
  }

  /**
   * Set whether or not to send the no-permisions message
   * @param id Guild ID
   * @param value Whether or not to send no-permissions message
   */
  async setSendPermsMessage (id: string, value: boolean): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.options.no_permissions = value
    return await this.updateGuild(guildData)
  }

  /**
   * Get a guild's XP Cooldown
   * @param id Guild ID
   */
  async getXPCooldown (id: string): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.level.cooldown
  }

  /**
   * Set a guild's XP Cooldown
   * @param id Guild ID
   * @param cooldown The new XP cooldown
   */
  async setXPCooldown (id: string, cooldown: string): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.level.cooldown = cooldown
    return await this.updateGuild(guildData)
  }

  /**
   * Get a guild's XP multiplier
   * @param id Guild ID
   */
  async getXPMultiplier (id: string): Promise<number> {
    const guildData = await this.getGuild(id)
    return guildData.level.xp_multplier
  }

  /**
   * Set a guild's XP multiplier
   * @param id Guild ID
   * @param multiplier The XP multiplier
   */
  async setXPMultiplier (id: string, multiplier: number): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.level.xp_multplier = multiplier
    return await this.updateGuild(guildData)
  }

  /**
   * Get whether or not to send a Level-Up message
   * @param id Guild ID
   */
  async getSendLevelMessage (id: string): Promise<boolean> {
    const guildData = await this.getGuild(id)
    return guildData.level.send_level_message
  }

  /**
   * Set whether or not to send a Level-Up message
   * @param id Guild ID
   * @param value Whether or not to send the Level-Up message
   */
  async setSendLevelMessage (id: string, value: boolean): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.level.send_level_message = value
    return await this.updateGuild(guildData)
  }

  /**
   * Get a guild's Level-Up Message
   * @param id Guild ID
   */
  async getLevelMessage (id: string): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.level.level_message
  }

  /**
   * Set a guild's Level-Up Message
   * @param id Guild ID
   * @param message The Level-Up message
   */
  async setLevelMessage (id: string, message: string): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.level.level_message = message
    return await this.updateGuild(guildData)
  }

  /**
   * Get the default level color of a guild
   * @param id The Guild ID
   */
  async getLevelColor (id: string): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.level.default_color
  }

  /**
   * Set the default Level-Up color for a guild
   * @param id Guild ID
   * @param color The Level-Up Color
   */
  async setLevelColor (id: string, color: string): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.level.default_color = color
    return await this.updateGuild(guildData)
  }

  /**
   * Get the guild AutoRoles
   * @param id Guild ID
   */
  async getAutoRoles (id: string): Promise<any[]> {
    const guildData = await this.getGuild(id)
    return guildData.moderation.auto_role
  }

  /**
   * Add an AutoRole to the guild
   * @param id Guild ID
   * @param role The autorole
   */
  async addAutoRole (id: string, role: AutoRole): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.moderation.auto_role.push(role)
    return await this.updateGuild(guildData)
  }

  /**
   * Delete an autorole
   * @param id Guild ID
   * @param role The autorole
   */
  async delAutoRole (id: string, role: AutoRole): Promise<GuildDoc> {
    const guildData = await this.getGuild(id)
    guildData.moderation.auto_role = guildData.moderation.auto_role.filter(r => r.id !== role.id)
    return this.updateGuild(guildData)
  }

  /**
   * Get a moderation Doc from the DB
   * @param guildID Guild ID
   * @param number The case number for that guild
   */
  async getModeration (guildID: string, number: number): Promise<ModerationDoc | null> {
    const fromDB: ModerationDoc = await moderationModel.findOne({ guildID, number }).lean()
    return fromDB
  }

  /**
   * Add a level role to the fuckin array
   * @param guildID Guild ID
   * @param roleID Role ID
   */
  async addLevelRole (guildID: string, roleID: string, level: number): Promise<GuildDoc> {
    const guildData = await this.getGuild(guildID)
    guildData.level.level_roles.push({
      id: roleID,
      level: level
    })
    return await this.updateGuild(guildData)
  }

  /**
   * Get the language from the guild
   * @param guildID Guild ID
   */
  async getLang (guildID: string): Promise<string> {
    const guildData = await this.getGuild(guildID)
    return guildData.options.lang
  }

  /**
   * Get the language from the guild
   * @param guildID Guild ID
   */
  async setLang (guildID: string, lang: string): Promise<GuildDoc> {
    const guildData = await this.getGuild(guildID)
    guildData.options.lang = lang
    return await this.updateGuild(guildData)
  }
}

/**
 * The Guild options
 */
interface GuildDoc {
  /**
   * Guild ID
   */
  id: string
  /**
   * Basic options
   */
  options: {
    /**
     * Guild Prefix
     */
    prefix: string
    /**
     * Whether or not to send in embeds
     */
    embeds: boolean
    /**
     * Whether or not to send no-permissions messages
     */
    no_permissions: boolean
    /**
     * What language to respond in
     */
    lang: string
  }
  /**
   * Leveling options
   */
  level: {
    /**
     * The delay between gaining xp
     */
    cooldown: string
    /**
     * The XP Multplier
     */
    xp_multplier: number
    /**
     * Whether or not to send the level message
     */
    send_level_message: boolean
    /**
     * The Level-Up message to be sent
     */
    level_message: string
    /**
     * the default color of a rank card
     */
    default_color: string
    /**
     * Automatic roles on levels
     */
    level_roles: LevelRole[]
  }
  /**
   * Moderation settings
   */
  moderation: {
    /**
     * The id of the role to give when muting
     */
    mute_role: string
    /**
     * The channel to send logs
     */
    log_channel: string
    /**
     * The auto role options
     */
    auto_role: AutoRole[]
  }
}

/**
 * The auto role options
 */
interface LevelRole {
  /**
   * The ID of the string
   */
  id: string
  /**
   * The level for it to be given on
   */
  level: number
}

/**
 * The auto role options
 */
interface AutoRole {
  /**
   * The ID of the role
   */
  id: string
  /**
   * How long to wait before giving it (in miliseconds)
   */
  delay: number
}

/**
 * Moderation database document
 */
interface ModerationDoc {
  /**
   * The ID of the guild it was in
   */
  guildID: string
  /**
   * The case number
   */
  number: number
  /**
   * Info about it
   */
  info: {
    /**
     * Who was the action on
     */
    member: string
    /**
     * What was the acction
     */
    action: 'BAN' | 'KICK' | 'MUTE' | 'WARN'
    /**
     * What was the reason for the action
     */
    reason: string
    /**
     * The ID of the moderator who did the action
     */
    moderator: string
    /**
     * The timesampt of the action
     */
    timestamp: string
  }
  /**
   * The log stuff
   * This is for editing the message
   */
  log_message: {
    /**
     * The channel ID
     */
    channel: string
    /**
     * The message ID
     */
    message: string
  }
}
