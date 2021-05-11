import { Schema, model } from 'mongoose'

const voteSchema = new Schema({
  id: { type: String, required: true, unique: true },
  total_votes: { type: Number, default: 1 },
  votes_worth: { type: Number, default: 1 },
  votes: { type: Array, default: [] }
})

const voteModel = model('users.votes', voteSchema)

export default class VoteDB {
  /**
   * Get a VoteDoc
   * @param id User ID
   */
  async getVotes (id: string): Promise<VoteDoc> {
    // Then check the DB
    const fromDB: VoteDoc = await voteModel.findOne({ id }).lean()
    if (fromDB !== null) return fromDB

    // Otherwise create a new one
    return {
      id,
      total_votes: 0,
      votes: [],
      votes_worth: 0
    }
  }

  /**
   * Create the default level doc
   * @param userID User ID
   * @param guildID Guild ID
   */
  async createVote (id: string): Promise<VoteDoc> {
    await voteModel.create({ id })
    return await this.getVotes(id)
  }

  /**
   * Update a user's Level doc
   * @param doc The already-existing level document
   */
  async addVote (id: string, vote: Vote): Promise<void> {
    const votes = await this.getVotes(id)

    vote.number = votes.votes.length
    votes.votes.push(vote)
    votes.total_votes++
    votes.votes_worth = votes.votes_worth + vote.worth

    await voteModel.updateOne({ id }, votes, { upsert: true }).lean()
  }
}
