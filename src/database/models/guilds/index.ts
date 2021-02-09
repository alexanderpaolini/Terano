import { Cache } from '../../../../../discord-rose/dist/utils/Cache'

import GuildModel from './guilds'
import ModerationModel from './moderation'

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

  async updateGuild(id: string, doc: any): Promise<GuildDoc | null> {
    doc = doc as GuildDoc
    this.guilds.set(id, doc)
    await GuildModel.findOneAndUpdate({ id }, doc)
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

  async updateModeration(gID: string, number: number, doc: ModerationDoc): Promise<ModerationDoc> {
    const data = await this.getModeration(gID, number) as ModerationDoc;
    if (data) {
      const newData: ModerationDoc = await ModerationModel.findOneAndUpdate({ guildID: gID, number: number }, doc).lean();
      this.moderation.set(`${gID}${number}`, newData)
      return newData;
    } else return null;
  }

}