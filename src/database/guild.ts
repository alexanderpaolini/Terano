import { Cache } from 'discord-rose/dist/utils/Cache'

import GuildModel from './models/guilds/guild'
import ModerationModel from './models/guilds/moderation'
import MuteModel from './models/guilds/mute'

export default class GuildDB {
  /**
   * The Guilds in cache
   */
  guilds: Cache<string, GuildDoc> = new Cache(15 * 60 * 1000);

  // Constructor goes here

  /**
   * Get a guild doc from the cache/DB
   * @param id The ID of the guild
   */
  async getGuild(id: string): Promise<GuildDoc> {
    // Check the cache first
    const fromCache = this.guilds.get(id)
    if (fromCache) return fromCache;

    // Then check the DB
    const fromDB: GuildDoc = await GuildModel.findOne({ id }).lean();
    if (fromDB) {
      // Add it to the cache
      this.guilds.set(id, fromDB);
      return fromDB;
    }

    // Otherwise create a new one
    return this.createGuild(id);
  }

  /**
   * Create the default guild doc
   * @param id The ID of the guild
   */
  async createGuild(id: string): Promise<GuildDoc> {
    await GuildModel.create({ id }) as unknown as GuildDoc;
    return this.getGuild(id);
  }

  /**
   * Update a guild doc
   * @param doc The already-existing guild document
   */
  async updateGuild(doc: GuildDoc) {
    // @ts-ignore
    delete doc._id!;
    this.guilds.set(doc.id, doc);
    return GuildModel.findOneAndUpdate({ id: doc.id }, doc).lean() as unknown as GuildDoc;
  }

  /**
   * Get a guild's prefix
   * @param id Guild ID
   */
  async getPrefix(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.options.prefix;
  }

  /**
   * Set a guild's prefix
   * @param id Guild ID
   * @param prefix The new prefix
   */
  async setPrefix(id: string, prefix: string) {
    const guildData = await this.getGuild(id);
    guildData.options.prefix = prefix;
    return this.updateGuild(guildData);
  }

  /**
   * Get whether or not to send embeds
   * @param id Guild ID
   */
  async getEmbeds(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.options.embeds
  }

  /**
   * Set whether or not to send embeds
   * @param id Guild ID
   * @param value Whether or not to send embeds
   */
  async setEmbeds(id: string, value: boolean) {
    const guildData = await this.getGuild(id);
    guildData.options.embeds = value;
    return this.updateGuild(guildData);
  }

  /**
   * Get whether or not to send the no-permissions message
   * @param id Guild ID
   */
  async getSendPermsMessage(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.options.no_permissions;
  }

  /**
   * Set whether or not to send the no-permisions message
   * @param id Guild ID
   * @param value Whether or not to send no-permissions message
   */
  async setSendPermsMessage(id: string, value: boolean) {
    const guildData = await this.getGuild(id);
    guildData.options.no_permissions = value;
    return this.updateGuild(guildData);
  }

  async getXPCooldown(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.level.cooldown;
  }

  /**
   * Set a guild's XP Cooldown
   * @param id Guild ID
   * @param cooldown The new XP cooldown
   */
  async setXPCooldown(id: string, cooldown: number) {
    const guildData = await this.getGuild(id);
    guildData.level.cooldown = cooldown;
    return this.updateGuild(guildData);
  }

  /**
   * Get a guild's XP multiplier
   * @param id Guild ID
   */
  async getXPMultiplier(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.level.xp_multplier;
  }

  /**
   * Set a guild's XP multiplier
   * @param id Guild ID
   * @param multiplier The XP multiplier
   */
  async setXPMultiplier(id: string, multiplier: number) {
    const guildData = await this.getGuild(id);
    guildData.level.xp_multplier = multiplier;
    return this.updateGuild(guildData);
  }

  /**
   * Get whether or not to send a Level-Up message
   * @param id Guild ID
   */
  async getSendLevelMessage(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.level.send_level_message;
  }

  /**
   * Set whether or not to send a Level-Up message
   * @param id Guild ID
   * @param value Whether or not to send the Level-Up message
   */
  async setSendLevelMessage(id: string, value: boolean) {
    const guildData = await this.getGuild(id);
    guildData.level.send_level_message = value;
    return this.updateGuild(guildData);
  }

  /**
   * Get a guild's Level-Up Message
   * @param id Guild ID
   */
  async getLevelMessage(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.level.level_message;
  }

  /**
   * Set a guild's Level-Up Message
   * @param id Guild ID
   * @param message The Level-Up message
   */
  async setLevelMessage(id: string, message: string) {
    const guildData = await this.getGuild(id);
    guildData.level.level_message = message;
    return this.updateGuild(guildData);
  }

  async getLevelColor(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.level.default_color;
  }

  /**
   * Set the default Level-Up color for a guild
   * @param id Guild ID
   * @param color The Level-Up Color
   */
  async setLevelColor(id: string, color: string) {
    const guildData = await this.getGuild(id);
    guildData.level.default_color = color;
    return this.updateGuild(guildData);
  }

  /**
   * Get the guild AutoRoles
   * @param id Guild ID
   */
  async getAutoRoles(id: string) {
    const guildData = await this.getGuild(id);
    return guildData.moderation.auto_role
  }

  /**
   * Add an AutoRole to the guild
   * @param id Guild ID
   * @param role The autorole
   */
  async addAutoRole(id: string, role: AutoRole) {
    const guildData = await this.getGuild(id);
    guildData.moderation.auto_role.push(role);
    return this.updateGuild(guildData);
  }

  /**
   * Delete an autorole
   * @param id Guild ID
   * @param role The autorole
   */
  async delAutoRole(id: string, role: AutoRole) {
    const guildData = await this.getGuild(id);
    guildData.moderation.auto_role = guildData.moderation.auto_role.filter(r => r.id !== role.id);
    return this.updateGuild(guildData);
  }

  
  /**
   * Get a moderation Doc from the DB
   * @param guildID Guild ID
   * @param number The case number for that guild
   */
  async getModeration(guildID: string, number: number): Promise<ModerationDoc | null> {
    const fromDB: ModerationDoc = await ModerationModel.findOne({ guildID, number }).lean();
    return fromDB;
  }

  /**
   * Add a level role to the fuckin array
   * @param guildID Guild ID
   * @param roleID Role ID
   */
  async addLevelRole(guildID: string, roleID: string, level: number) {
    const guildData = await this.getGuild(guildID);
    guildData.level.level_roles.push({
      id: roleID,
      level: level
    })
    await this.updateGuild(guildData);
  }
}
