import { Cache } from 'discord-rose/dist/utils/Cache'

import GuildModel from './models/guilds/guilds'
import ModerationModel from './models/guilds/moderation'

interface GuildDoc {
  id: string,
  prefix: string,
  options: {
    embeds: boolean,
    noPermissions: boolean,
    level: {
      xp_rate: number,
      send_message: boolean,
      default_color: string,
      level_message: string,
      cooldown: number
    }
  }
}

interface ModerationDoc {
  guildID: string,
  number: number,
  prefix: string,
  info: {
    member: string,
    action: 'BAN' | 'KICK' | 'MUTE' | 'WARN',
    reason: string,
    moderator: string,
    timestamp: string
  }
}

export default class GuildDB {
  guilds: Cache<string, GuildDoc>;
  moderation: Cache<string, ModerationDoc>;
  constructor() {
    this.guilds = new Cache(15 * 60 * 1000)
    this.moderation = new Cache(15 * 60 * 1000)
  }

  async setGuild(doc: GuildDoc): Promise<GuildDoc> {
    await GuildModel.create(doc);
    return await this.getGuild(doc.id);
  }

  async getGuild(id: string): Promise<GuildDoc | null> {
    const fromCache = this.guilds.get(id);
    if (fromCache) return fromCache;
    const doc: GuildDoc = await GuildModel.findOne({ id }).lean()
    if (doc) {
      this.guilds.set(id, doc);
      return doc;
    } else return null;
  }

  async updateGuild(doc: GuildDoc): Promise<GuildDoc | null> {
    this.guilds.set(doc.id, doc)
    await GuildModel.findOneAndUpdate({ id: doc.id }, doc)
    return;
  }

  async setModeration(doc: ModerationDoc): Promise<ModerationDoc> {
    this.moderation.set(`${doc.guildID}${doc.number}`, doc);
    return await this.getModeration(doc.guildID, doc.number) as ModerationDoc;
  }

  async getModeration(gID: string, number?: number): Promise<ModerationDoc | ModerationDoc[] | null> {
    if (!number) {
      const docs: ModerationDoc[] = await ModerationModel.find({ guildID: gID }).lean()
      return docs;
    } else {
      const fromCache = this.moderation.get(`${gID}${number}`)
      if (fromCache) return fromCache;
      const doc: ModerationDoc = await ModerationModel.findOne({ guildID: gID, number: number }).lean()
      this.moderation.set(`${gID}${number}`, doc);
      return doc;
    }
  }

  async updateModeration(doc: ModerationDoc): Promise<ModerationDoc> {
    const data = await this.getModeration(doc.guildID, doc.number) as ModerationDoc;
    if (data) {
      const newData: ModerationDoc = await ModerationModel.findOneAndUpdate({ guildID: doc.guildID, number: doc.number }, doc).lean();
      this.moderation.set(`${doc.guildID}${doc.number}`, newData)
      return newData;
    } else return null;
  }


  // Other functions
  // These functions will be used 
  // for getting/changing 1 or 2 things

  // Get the prefix from the DB
  async getPrefix(guildID: string): Promise<string> {
    const guildData = await this.getGuild(guildID);
    return guildData?.prefix
  }

  // Update the prefix
  async updatePrefix(guildID: string, prefix: string) {
    const guildData = await this.getGuild(guildID);
    guildData.prefix = prefix;
    this.updateGuild(guildData);
    return;
  }

  // Get the message cooldown
  async getMsgCooldown(guildID: string): Promise<number> {
    const guildData = await this.getGuild(guildID);
    return guildData?.options.level.cooldown
  }

  // Update the message cooldown
  async updateMsgCooldown(guildID: string, cooldown: number) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.cooldown = cooldown;
    this.updateGuild(guildData);
    return;
  }

  // Get whether or not to send the level message
  async getSendLevelMessage(guildID: string): Promise<boolean> {
    const guildData = await this.getGuild(guildID)
    return guildData?.options.level.send_message;
  }

  // Set whether or not to send the level message
  async updateSendLevelMessage(guildID: string, send: boolean) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.send_message = send;
    this.updateGuild(guildData);
    return;
  }

  // Get the XP-Multiplier
  async getXPMultplier(guildID: string) {
    const guildData = await this.getGuild(guildID);
    return guildData?.options.level.xp_rate
  }

  // Set the XP-Multplier
  async updateXPMultplier(guildID: string, multiplier: number) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.xp_rate = multiplier;
    this.updateGuild(guildData);
    return;
  }
}