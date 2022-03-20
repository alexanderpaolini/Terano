import { Cache } from '@jpbberry/cache'
import { Snowflake } from 'discord-api-types'
import { model, Schema } from 'mongoose'

const guildSchema = new Schema({
  id: { type: String, required: true, unique: true },
  options: {
    prefix: { type: String, default: 't!' },
    embeds: { type: Boolean, default: true },
    no_permissions: { type: Boolean, default: true },
    lang: { type: String, default: 'en-US' }
  },
  level: {
    cooldown: { type: Number, default: 15 },
    xp_multplier: { type: Number, default: 1 },
    send_level_message: { type: Boolean, default: false },
    level_message: { type: String, default: 'You are now level {{level}}!' },
    default_color: { type: String, default: '#07bb5b' },
    level_roles: { type: Array, default: [] }
  }
})

const guildModel = model('guilds', guildSchema)

export class GuildDb {
  /**
   * The Guilds in cache
   */
  guilds: Cache<string, GuildDoc> = new Cache(15 * 60 * 1000)

  guildModel = guildModel

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
  async updateGuild (doc: GuildDoc): Promise<void> {
    this.guilds.set(doc.id, doc)
    await guildModel.updateOne({ id: doc.id }, doc).lean()
  }

  /**
   * Get a guild's XP Cooldown
   * @param id Guild ID
   */
  async getXPCooldown (id: string): Promise<number> {
    const guildData = await this.getGuild(id)
    return guildData.level.cooldown
  }

  /**
   * Set a guild's XP Cooldown
   * @param id Guild ID
   * @param cooldown The new XP cooldown
   */
  async setXPCooldown (id: string, cooldown: number): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.level.cooldown = cooldown
    await this.updateGuild(guildData)
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
  async setXPMultiplier (id: string, multiplier: number): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.level.xp_multplier = multiplier
    await this.updateGuild(guildData)
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
  async setSendLevelMessage (id: string, value: boolean): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.level.send_level_message = value
    await this.updateGuild(guildData)
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
  async setLevelMessage (id: string, message: string): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.level.level_message = message
    await this.updateGuild(guildData)
  }

  /**
   * Get the default level color of a guild
   * @param id The Guild ID
   */
  async getDefaultLevelColor (id: string): Promise<string> {
    const guildData = await this.getGuild(id)
    return guildData.level.default_color
  }

  /**
   * Set the default Level-Up color for a guild
   * @param id Guild ID
   * @param color The Level-Up Color
   */
  async setDefaultLevelColor (id: string, color: string): Promise<void> {
    const guildData = await this.getGuild(id)
    guildData.level.default_color = color
    await this.updateGuild(guildData)
  }

  /**
   * Add a level role to the fuckin array
   * @param guildId Guild ID
   * @param roleId Role ID
   */
  async addLevelRole (guildId: string, roleId: string, level: number): Promise<void> {
    const guildData = await this.getGuild(guildId)
    guildData.level.level_roles.push({
      id: roleId,
      level: level
    })
    await this.updateGuild(guildData)
  }
}

/**
 * The Guild options
 */
export interface GuildDoc {
  /**
   * Guild ID
   */
  id: Snowflake
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
    cooldown: number
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
