import { Cache } from 'discord-rose/dist/utils/Cache';

import VoteModel from './models/users/vote';

export default class VoteDB {
  /**
   * The Settings
   */
  cache: Cache<string, VoteDoc> = new Cache(15 * 60 * 1000);

  // Constructor goes here
  // Placeholder
  // Constructor goes here

  /**
   * Get a VoteDoc
   * @param id User ID
   */
  async getVotes(id: string): Promise<VoteDoc> {
    // Check the cache first
    const fromCache = this.cache.get(id);
    if (fromCache) return fromCache;

    // Then check the DB
    const fromDB: VoteDoc = await VoteModel.findOne({ id }).lean();
    if (fromDB) {
      // Add it to the cache
      this.cache.set(id, fromDB);
      return fromDB;
    }

    // Otherwise create a new one
    return {
      id,
      total_votes: 0,
      votes: [],
      votes_worth: 0
    };
  }

  /**
   * Create the default level doc
   * @param userID User ID
   * @param guildID Guild ID
   */
  async createVote(id: string): Promise<VoteDoc> {
    await VoteModel.create({ id });
    return this.getVotes(id);
  }

  /**
   * Update a user's Level doc
   * @param doc The already-existing level document
   */
  async addVote(id: string, vote: Vote): Promise<LevelDoc> {
    const votes = await this.getVotes(id);

    vote.number = votes.votes.length;
    votes.votes.push(vote);
    votes.total_votes++;
    votes.votes_worth = votes.votes_worth + vote.worth;

    this.cache.set(id, votes);
    return VoteModel.findOneAndUpdate({ id }, votes, { upsert: true }).lean() as unknown as LevelDoc;
  }
}
