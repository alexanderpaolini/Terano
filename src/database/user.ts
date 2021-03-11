import { Cache } from 'discord-rose/dist/utils/Cache';

import LevelModel from './models/users/level';
import InfoModel from './models/users/info';
import UserModel from './models/users/user';

export default class UserDB {
  /**
   * The level data in cache
   */
  levels: Cache<string, LevelDoc> = new Cache(15 * 60 * 1000);
  /**
   * The infos
   */
  infos: Cache<string, InfoDoc> = new Cache(15 * 60 * 1000);
  /**
   * The Settings
   */
  settings: Cache<string, SettingsDoc> = new Cache(15 * 60 * 1000);

  // Constructor goes here
  // Placeholder
  // Constructor goes here

  /**
   * Get a LevelDoc
   * @param userID User ID
   * @param guildID Guild ID
   */
  async getLevel(userID: string, guildID: string) {
    // Check the cache first
    const fromCache = this.levels.get(`${userID}${guildID}`);
    if (fromCache) return fromCache;

    // Then check the DB
    const fromDB: LevelDoc = await LevelModel.findOne({ userID, guildID }).lean();
    if (fromDB) {
      // Add it to the cache
      this.levels.set(`${userID}${guildID}`, fromDB);
      return fromDB;
    }

    // Otherwise create a new one
    return {
      userID,
      guildID,
      xp: '0',
      level : 0
    };
  }

  /**
   * Create the default level doc
   * @param userID User ID
   * @param guildID Guild ID
   */
  async createLevel(userID: string, guildID: string): Promise<LevelDoc> {
    await LevelModel.create({ userID, guildID });
    return this.getLevel(userID, guildID);
  }

  /**
   * Update a user's Level doc
   * @param doc The already-existing level document
   */
  async updateLevel(doc: LevelDoc): Promise<LevelDoc> {
    this.levels.set(`${doc.userID}${doc.guildID}`, doc);
    return LevelModel.findOneAndUpdate({ userID: doc.userID, guildID: doc.guildID }, doc, { upsert: true }).lean() as unknown as LevelDoc;
  }

  /**
   * Get a user's level
   * @param userID User ID
   * @param guildID Guild ID
   */
  async getUserLevel(userID: string, guildID: string) {
    const levelData = await this.getLevel(userID, guildID);
    return levelData.level;
  }

  /**
   * Set a user's level
   * @param userID User ID
   * @param guildID Guild ID
   * @param level The new level
   */
  async setUserLevel(userID: string, guildID: string, level: number) {
    const levelData = await this.getLevel(userID, guildID);
    levelData.level = level;
    return this.updateLevel(levelData);
  }

  /**
   * Get a user's xp
   * @param userID User ID
   * @param guildID Guild ID
   */
  async getUserXP(userID: string, guildID: string) {
    const levelData = await this.getLevel(userID, guildID);
    return levelData.xp;
  }

  async getInfo(id: string): Promise<InfoDoc> {
    // Check the cache first
    const fromCache = this.infos.get(id);
    if (fromCache) return fromCache;

    // Then check the DB
    const fromDB: InfoDoc = await InfoModel.findOne({ id }).lean();
    if (fromDB) {
      // Add it to the cache
      this.infos.set(id, fromDB);
      return fromDB;
    }

    // Otherwise create a new one
    return { 
      id: id,
      owner: false,
      blacklisted: false
    }
  }

  /**
   * Create the user info for the user
   * @param id User ID
   */
  async createInfo(id: string): Promise<InfoDoc> {
    await InfoModel.create({ id });
    return this.getInfo(id);
  }

  /**
   * Update a user's info
   * @param doc The already existing Info Document
   */
  async updateInfo(doc: InfoDoc): Promise<InfoDoc> {
    this.infos.set(doc.id, doc);
    return InfoModel.findOneAndUpdate({ id: doc.id }, doc, { upsert: true }).lean() as unknown as InfoDoc;
  } 

  /**
   * Get if a user is blacklisted
   * @param id User ID
   */
  async getBlacklist(id: string) {
    const infoData = await this.getInfo(id);
    return infoData.blacklisted;
  }

  /**
   * Set whether or not a user is blacklisted
   * @param id User ID
   * @param value Whether or not they are blacklisted
   */
  async setBlacklist(id: string, value: boolean) {
    const infoData = await this.getInfo(id);
    infoData.blacklisted = value;
    return this.updateInfo(infoData);
  }

  /**
   * Get whether or not a user is owner
   * @param id User ID
   */
  async getOwner(id: string) {
    const infoData = await this.getInfo(id);
    return infoData.owner;
  }

  /**
   * Set whether or not a user is owner
   * @param id User iD
   * @param value Whether or not they are owner
   */
  async setOwner(id: string, value: boolean) {
    const infoData = await this.getInfo(id);
    infoData.owner = value;
    return this.updateInfo(infoData);
  }

  /**
   * Get a user's settings
   * @param id User ID
   */
  async getSettings(id: string): Promise<SettingsDoc> {
    // Check the cache first
    const fromCache = this.settings.get(id);
    if (fromCache) return fromCache;

    // Then check the DB
    const fromDB: SettingsDoc = await UserModel.findOne({ id }).lean();
    if (fromDB) {
      // Add it to the cache
      this.settings.set(id, fromDB);
      return fromDB;
    }

    // Otherwise create a new one
    return {
      id: id,
      level: {
        tag: '',
        color:'',
        picture: ''
      }
    }
  }

  /**
   * Create the default settings
   * @param id User ID
   */
  async createSettings(id: string) {
    await UserModel.create({ id });
    return this.getSettings(id);
  }

  /**
   * Update a user's settings
   * @param doc Already existing settings doc
   */
  async updateSettings(doc: SettingsDoc) {
    this.settings.set(doc.id, doc);
    return UserModel.findOneAndUpdate({ id: doc.id }, doc, { upsert: true }).lean() as unknown as LevelDoc;
  }

  /**
   * Get the color for a user
   * @param id User ID
   */
  async getColor(id: string) {
    const userSettings = await this.getSettings(id);
    return userSettings.level.color;
  }

  /**
   * Set the color for a user
   * @param id User ID
   * @param color Thew new color hex code thing
   */
  async setColor(id: string, color: string) {
    const userSettings = await this.getSettings(id);
    userSettings.level.color = color;
    return this.updateSettings(userSettings);
  }

  /**
   * Get a user's tag
   * @param id User ID
   */
  async getTag(id: string) {
    const userSettings = await this.getSettings(id);
    return userSettings.level.tag;
  }

  /**
   * Set a user's tag
   * @param id User ID
   * @param tag The new tag
   */
  async setTag(id: string, tag: string) {
    const userSettings = await this.getSettings(id);
    userSettings.level.tag = tag;
    return this.updateSettings(userSettings);
  }

  /**
   * Get a user's picture
   * @param id User ID
   */
  async getPicture(id: string) {
    const userSettings = await this.getSettings(id);
    return userSettings.level.picture;
  }

  /**
   * Set the user's prefix
   * @param id User ID
   * @param link Link to be updated to
   */
  async setPicture(id: string, link: string) {
    const userSettings = await this.getSettings(id);
    userSettings.level.picture = link;
    return this.updateSettings(userSettings);
  }

  /**
   * Get all of the levels, or all of the levels for a guild
   * @param guildID The Guild ID, optional
   */
  async getAllLevels(guildID?: string): Promise<LevelDoc[]> {
    let docs: LevelDoc[];
    if (guildID) {
      docs = await LevelModel.find({ guildID }).lean();
    }
    else docs = await LevelModel.find().lean();
    return docs;
  }
}
