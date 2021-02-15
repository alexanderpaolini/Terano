import { Cache } from 'discord-rose/dist/utils/Cache';

import GuildModel from './models/guilds/guilds';
import ModerationModel from './models/guilds/moderation';
import MuteModel from './models/guilds/mute';

interface GuildDoc {
  id: string,
  prefix: string,
  options: {
    embeds: boolean,
    no_permissions: boolean,
    level: {
      xp_rate: number,
      send_message: boolean,
      default_color: string,
      level_message: string,
      cooldown: number;
    };
    moderation: {
      log_channel: string,
      mute_role: string;
    };
  };
}

interface ModerationDoc {
  guildID: string,
  number: number,
  info: {
    member: string,
    action: 'BAN' | 'KICK' | 'MUTE' | 'WARN',
    reason: string,
    moderator: string,
    timestamp: string;
  };
  log_message: string;
}

interface MuteDoc {
  guildID: string;
  userID: string;
  timestamp: string;
}

export default class GuildDB {
  guilds: Cache<string, GuildDoc>;
  moderation: Cache<string, ModerationDoc>;
  constructor() {
    this.guilds = new Cache(15 * 60 * 1000);
    this.moderation = new Cache(15 * 60 * 1000);
  }

  // Defaults

  get prefix() {
    return 't!';
  }

  async setGuild(doc: GuildDoc): Promise<GuildDoc> {
    await GuildModel.create(doc);
    return await this.getGuild(doc.id);
  }

  async getGuild(id: string): Promise<GuildDoc | null> {
    const fromCache = this.guilds.get(id);
    if (fromCache) return fromCache;
    const doc: GuildDoc = await GuildModel.findOne({ id }).lean();
    if (doc) {
      this.guilds.set(id, doc);
      return doc;
    } else return null;
  }

  async updateGuild(doc: GuildDoc): Promise<GuildDoc | null> {
    this.guilds.set(doc.id, doc);
    await GuildModel.findOneAndUpdate({ id: doc.id }, doc);
    return;
  }

  async setModeration(doc: ModerationDoc): Promise<ModerationDoc> {
    this.moderation.set(`${doc.guildID}${doc.number}`, doc);
    await ModerationModel.create(doc);
    return await this.getModeration(doc.guildID, doc.number);
  }

  async getModeration(gID: string, number: number): Promise<ModerationDoc | null> {
    const fromCache = this.moderation.get(`${gID}${number}`);
    if (fromCache) return fromCache;
    const doc: ModerationDoc = await ModerationModel.findOne({ guildID: gID, number: number }).lean();
    this.moderation.set(`${gID}${number}`, doc);
    return doc;
  }

  async getAllModeration(gID: string, number?: number): Promise<ModerationDoc | ModerationDoc[] | null> {
    if (!number) {
      const docs: ModerationDoc[] = await ModerationModel.find({ guildID: gID }).lean();
      return docs;
    } else {
      const fromCache = this.moderation.get(`${gID}${number}`);
      if (fromCache) return fromCache;
      const doc: ModerationDoc = await ModerationModel.findOne({ guildID: gID, number: number }).lean();
      this.moderation.set(`${gID}${number}`, doc);
      return doc;
    }
  }

  async updateModeration(doc: ModerationDoc): Promise<ModerationDoc> {
    const data = await this.getModeration(doc.guildID, doc.number);
    if (data) {
      const newData: ModerationDoc = await ModerationModel.findOneAndUpdate({ guildID: doc.guildID, number: doc.number }, doc).lean();
      this.moderation.set(`${doc.guildID}${doc.number}`, newData);
      return newData;
    } else return null;
  }


  // Other functions
  // These functions will be used 
  // for getting/changing 1 or 2 things

  // Get the prefix from the DB
  async getPrefix(guildID: string): Promise<string> {
    const guildData = await this.getGuild(guildID);
    return guildData?.prefix || this.prefix;
  }

  async getEmbed(guildID: string): Promise<boolean> {
    const guildData = await this.getGuild(guildID);
    return guildData.options.embeds;
  }

  async setEmbed(guildID: string, value: boolean): Promise<boolean> {
    const guildData = await this.getGuild(guildID);
    guildData.options.embeds = value;
    this.updateGuild(guildData);
    return;
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
    return guildData?.options.level.cooldown;
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
    const guildData = await this.getGuild(guildID);
    return guildData?.options.level.send_message;
  }

  // Set whether or not to send the level message
  async setSendLevelMessage(guildID: string, send: boolean) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.send_message = send;
    this.updateGuild(guildData);
    return;
  }

  // Get the XP-Multiplier
  async getXPMultplier(guildID: string) {
    const guildData = await this.getGuild(guildID);
    return guildData?.options.level.xp_rate;
  }

  // Set the XP-Multplier
  async setXPMultplier(guildID: string, multiplier: number) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.xp_rate = multiplier;
    this.updateGuild(guildData);
    return;
  }

  // Get the Mute Role
  async getMuteRole(guildID: string) {
    const guildData = await this.getGuild(guildID);
    return guildData.options.moderation.mute_role;
  }

  // Set the Mute Role
  async setMuteRole(guildID: string, roleID: string) {
    const guildData = await this.getGuild(guildID);
    guildData.options.moderation.mute_role = roleID;
    this.updateGuild(guildData);
    return;
  }

  // Set the Log Channel
  async getLogChannel(guildID: string) {
    const guildData = await this.getGuild(guildID);
    return guildData.options.moderation.log_channel;
  }

  // Set the Log Channel
  async setLogChannel(guildID: string, logID: string) {
    const guildData = await this.getGuild(guildID);
    guildData.options.moderation.log_channel = logID;
    this.updateGuild(guildData);
    return;
  }

  // Get the level message
  async getLevelMessage(guildID: string) {
    const guildData = await this.getGuild(guildID);
    return guildData.options.level.level_message;
  }

  // Set the level message
  async setLevelMessage(guildID: string, message: string) {
    const guildData = await this.getGuild(guildID);
    guildData.options.level.level_message = message;
    this.updateGuild(guildData);
    return;
  }

  async createGuild(guildID: string) {
    await this.setGuild({
      id: guildID,
      prefix: this.prefix,
      options: {
        embeds: true,
        no_permissions: true,
        level: {
          xp_rate: 1,
          send_message: false,
          default_color: '#07bb5b',
          level_message: 'You are now level {{level}}!',
          cooldown: 15
        },
        moderation: {
          log_channel: 'none',
          mute_role: 'none'
        }
      }
    });
    return true;
  }

  async getModerationNumber(guildID: string): Promise<number> {
    const docs: ModerationDoc[] = await ModerationModel.find({ guildID }).lean();
    return docs.length + 1;
  }

  async setModerationReason(guildID: string, number: number, reason: string) {
    const doc = await this.getModeration(guildID, number);
    doc.info.reason = reason;
    await this.updateModeration(doc);
    return;
  }

  async getMuteDocs(guildID?: string, userID?: string): Promise<MuteDoc[]> {
    let docs: MuteDoc[];
    if (guildID) {
      if (userID) docs = await ModerationModel.find({ guildID, userID }).lean();
      else docs = await ModerationModel.find({ guildID }).lean();
    }
    else docs = await MuteModel.find().lean();
    return docs;
  }

  async deleteMute(guildID: string, userID: string, timestamp: string) {
    await MuteModel.deleteOne({ guildID, userID, timestamp });
    return;
  }

  async createMute(guildID: string, userID: string, timestamp: string) {
    const mute: MuteDoc = {
      guildID,
      userID,
      timestamp
    };
    await MuteModel.create(mute);
    return;
  }

  async getNoPermsMessage(guildID: string) {
    const guildDoc = await this.getGuild(guildID);
    return guildDoc.options.no_permissions;
  }

  async setNoPermsMessage(guildID: string, value: boolean) {
    const guildDoc = await this.getGuild(guildID);
    guildDoc.options.no_permissions = value;
    await this.updateGuild(guildDoc);
    return;
  }

}