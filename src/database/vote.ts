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
  async addVote (id: string, vote: Vote): Promise<LevelDoc> {
    const votes = await this.getVotes(id)

    vote.number = votes.votes.length
    votes.votes.push(vote)
    votes.total_votes++
    votes.votes_worth = votes.votes_worth + vote.worth

    return voteModel.updateOne({ id }, votes, { upsert: true }).lean() as unknown as LevelDoc
  }
}

/**
 * User Vote Document in the DB
 */
export interface VoteDoc {
  /**
   * The ID of the user
   */
  id: string
  /**
   * The total amount of times the user has voted
   */
  total_votes: number
  /**
   * How many votes the votes were worth (weekends are worth 2x)
   */
  votes_worth: number
  /**
   * Array of votes
   */
  votes: Vote[]
}

/**
 * A vote
 */
interface Vote {
  /**
   * When the vote was made
   */
  date: string
  /**
   * How much it is worth (1: normal, 2: weekends)
   */
  worth: 1 | 2
  /**
   * How many votes before this
   */
  number?: number
  /**
   * Query if there
   */
  query?: string | {
    [key: string]: string
  }
  /**
   * Which bot it was for
   */
  bot: string
}
