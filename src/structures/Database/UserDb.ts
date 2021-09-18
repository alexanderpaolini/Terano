import { Schema, model } from 'mongoose'

import { Cache } from '@jpbberry/cache'

import { Snowflake } from 'discord-api-types'

const infoSchema = new Schema({
  id: { type: String, required: true, unique: true },
  owner: { type: Boolean, default: false },
  blacklisted: { type: Boolean, default: false }
})

const levelSchema = new Schema({
  guild_id: { type: String, required: true },
  user_id: { type: String, required: true },
  xp: { type: Number, default: '0' },
  level: { type: Number, default: 0 }
})

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  level: {
    tag: { type: String, default: '' },
    color: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
})

const infoModel = model('users.info', infoSchema)
const levelModel = model('users.levels', levelSchema)
const userModel = model('users.settings', userSchema)

export class UserDb {
  /**
   * The level data in cache
   */
  levels: Cache<`${Snowflake}${Snowflake}`, LevelDoc> = new Cache(15 * 60 * 1000)
  /**
   * The infos
   */
  infos: Cache<Snowflake, InfoDoc> = new Cache(15 * 60 * 1000)
  /**
   * The Settings
   */
  settings: Cache<Snowflake, SettingsDoc> = new Cache(15 * 60 * 1000)

  levelModel = levelModel
  infoModel = infoModel
  userModel = userModel

  /**
   * Get a LevelDoc
   * @param userId User ID
   * @param guildId Guild ID
   */
  async getLevel (userId: Snowflake, guildId: Snowflake): Promise<LevelDoc> {
    // Check the cache first
    const fromCache = this.levels.get(`${userId}${guildId}`)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: LevelDoc = await levelModel.findOne({ user_id: userId, guild_id: guildId }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.levels.set(`${userId}${guildId}`, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return {
      user_id: userId,
      guild_id: guildId,
      xp: 0,
      level: 0
    }
  }

  /**
   * Create the default level doc
   * @param userId User ID
   * @param guildId Guild ID
   */
  async createLevel (userId: Snowflake, guildId: Snowflake): Promise<LevelDoc> {
    await levelModel.create({ userId, guildId })
    return await this.getLevel(userId, guildId)
  }

  /**
   * Update a user's Level doc
   * @param doc The already-existing level document
   */
  async updateLevel (doc: LevelDoc): Promise<void> {
    this.levels.set(`${doc.user_id}${doc.guild_id}`, doc)
    await levelModel.updateOne({ user_id: doc.user_id, guild_id: doc.guild_id }, doc, { upsert: true }).lean()
  }

  /**
   * Get a user's level
   * @param userId User ID
   * @param guildId Guild ID
   */
  async getUserLevel (userId: Snowflake, guildId: Snowflake): Promise<number> {
    const levelData = await this.getLevel(userId, guildId)
    return levelData.level
  }

  /**
   * Set a user's level
   * @param userId User ID
   * @param guildId Guild ID
   * @param level The new level
   */
  async setUserLevel (userId: Snowflake, guildId: Snowflake, level: number): Promise<void> {
    const levelData = await this.getLevel(userId, guildId)
    levelData.level = level
    await this.updateLevel(levelData)
  }

  /**
   * Get a user's xp
   * @param userId User ID
   * @param guildId Guild ID
   */
  async getUserXP (userId: Snowflake, guildId: Snowflake): Promise<number> {
    const levelData = await this.getLevel(userId, guildId)
    return levelData.xp
  }

  async getInfo (id: Snowflake): Promise<InfoDoc> {
    // Check the cache first
    const fromCache = this.infos.get(id)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: InfoDoc = await infoModel.findOne({ id }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.infos.set(id, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return {
      user_id: id,
      owner: false,
      blacklisted: false
    }
  }

  /**
   * Create the user info for the user
   * @param id User ID
   */
  async createInfo (id: Snowflake): Promise<InfoDoc> {
    await infoModel.create({ id })
    return await this.getInfo(id)
  }

  /**
   * Update a user's info
   * @param doc The already existing Info Document
   */
  async updateInfo (doc: InfoDoc): Promise<void> {
    this.infos.set(doc.user_id, doc)
    await infoModel.updateOne({ id: doc.user_id }, doc, { upsert: true }).lean()
  }

  /**
   * Get if a user is blacklisted
   * @param id User ID
   */
  async getBlacklist (id: Snowflake): Promise<boolean> {
    const infoData = await this.getInfo(id)
    return infoData.blacklisted
  }

  /**
   * Set whether or not a user is blacklisted
   * @param id User ID
   * @param value Whether or not they are blacklisted
   */
  async setBlacklist (id: Snowflake, value: boolean): Promise<void> {
    const infoData = await this.getInfo(id)
    infoData.blacklisted = value
    await this.updateInfo(infoData)
  }

  /**
   * Get whether or not a user is owner
   * @param id User ID
   */
  async getOwner (id: Snowflake): Promise<boolean> {
    const infoData = await this.getInfo(id)
    return infoData.owner
  }

  /**
   * Set whether or not a user is owner
   * @param id User iD
   * @param value Whether or not they are owner
   */
  async setOwner (id: Snowflake, value: boolean): Promise<void> {
    const infoData = await this.getInfo(id)
    infoData.owner = value
    await this.updateInfo(infoData)
  }

  /**
   * Get a user's settings
   * @param id User ID
   */
  async getSettings (id: Snowflake): Promise<SettingsDoc> {
    // Check the cache first
    const fromCache = this.settings.get(id)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: SettingsDoc = await userModel.findOne({ id }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.settings.set(id, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return {
      id,
      level: {
        tag: '',
        color: '',
        picture: ''
      }
    }
  }

  /**
   * Create the default settings
   * @param id User ID
   */
  async createSettings (id: Snowflake): Promise<SettingsDoc> {
    await userModel.create({ id })
    return await this.getSettings(id)
  }

  /**
   * Update a user's settings
   * @param doc Already existing settings doc
   */
  async updateSettings (doc: SettingsDoc): Promise<void> {
    this.settings.set(doc.id, doc)
    await userModel.updateOne({ id: doc.id }, doc, { upsert: true }).lean()
  }

  /**
   * Get the color for a user
   * @param id User ID
   */
  async getColor (id: Snowflake): Promise<string> {
    const userSettings = await this.getSettings(id)
    return userSettings.level.color
  }

  /**
   * Set the color for a user
   * @param id User ID
   * @param color Thew new color hex code thing
   */
  async setColor (id: Snowflake, color: Snowflake): Promise<void> {
    const userSettings = await this.getSettings(id)
    userSettings.level.color = color
    await this.updateSettings(userSettings)
  }

  /**
   * Get a user's tag
   * @param id User ID
   */
  async getTag (id: Snowflake): Promise<string> {
    const userSettings = await this.getSettings(id)
    return userSettings.level.tag
  }

  /**
   * Set a user's tag
   * @param id User ID
   * @param tag The new tag
   */
  async setTag (id: Snowflake, tag: Snowflake): Promise<void> {
    const userSettings = await this.getSettings(id)
    userSettings.level.tag = tag
    await this.updateSettings(userSettings)
  }

  /**
   * Get a user's picture
   * @param id User ID
   */
  async getPicture (id: Snowflake): Promise<string> {
    const userSettings = await this.getSettings(id)
    return userSettings.level.picture
  }

  /**
   * Set the user's prefix
   * @param id User ID
   * @param link Link to be updated to
   */
  async setPicture (id: Snowflake, link: string): Promise<void> {
    const userSettings = await this.getSettings(id)
    userSettings.level.picture = link
    await this.updateSettings(userSettings)
  }

  /**
   * Get all of the levels, or all of the levels for a guild
   * @param guildId The Guild ID, optional
   */
  async getAllLevels (guildId: Snowflake | null = null): Promise<LevelDoc[]> {
    let docs: LevelDoc[]
    if (guildId != null) {
      docs = await levelModel.find({ guild_id: guildId }).lean()
    } else docs = await levelModel.find().lean()
    return docs
  }
}

/**
 * The member level in the DB
 */
interface LevelDoc {
  /**
   * The guild that this level corresponds to
   */
  guild_id: Snowflake
  /**
   * The user with the level
   */
  user_id: Snowflake
  /**
   * How much xp they have
   */
  xp: number
  /**
   * Their level
   */
  level: number
}

/**
 * User Settings document in the DB
 */
interface SettingsDoc {
  /**
   * The ID of the user
   */
  id: Snowflake
  /**
   * Configuration of the rank card
   */
  level: {
    /**
     * The Tag displayed
     */
    tag: string
    /**
     * The color of the card (hex format)
     */
    color: string
    /**
     * The picture that will be displayed
     */
    picture: string
  }
}

/**
 * The User Info
 */
interface InfoDoc {
  /**
   * The ID of the user
   */
  user_id: Snowflake
  /**
   * Whether or not the user is an owner
   */
  owner: boolean
  /**
   * Whether or not the user is blacklisted
   */
  blacklisted: boolean
}
