import { Schema, model } from 'mongoose'

import { Snowflake } from 'discord-api-types'

interface VoteDoc {
  id: string
  total_votes: number
  votes_worth: number
  votes: Vote[]
}

interface Vote {
  date: number
  worth: 1 | 2
  number?: number
  query?: string | {
    [key: string]: string
  }
  bot: string
}

const voteSchema = new Schema({
  id: { type: String, required: true, unique: true },
  total_votes: { type: Number, default: 1 },
  votes_worth: { type: Number, default: 1 },
  votes: { type: Array, default: [] }
})

const voteModel = model('users.votes', voteSchema)

export class VoteDB {
  async getVotes (id: string): Promise<VoteDoc> {
    const fromDB: VoteDoc = await voteModel.findOne({ id }).lean()
    if (fromDB !== null) return fromDB

    return {
      id,
      total_votes: 0,
      votes: [],
      votes_worth: 0
    }
  }

  async createVote (id: Snowflake): Promise<VoteDoc> {
    await voteModel.create({ id })
    return await this.getVotes(id)
  }

  async addVote (id: Snowflake, vote: Vote): Promise<void> {
    const votes = await this.getVotes(id)

    vote.number = votes.votes.length
    votes.votes.push(vote)
    votes.total_votes++
    votes.votes_worth = votes.votes_worth + vote.worth

    await voteModel.updateOne({ id }, votes, { upsert: true }).lean()
  }

  async getVoted12h (id: Snowflake): Promise<boolean> {
    const votes = await this.getVotes(id)

    const vote = votes.votes.find(e => Date.now() - e.date < 46800000)

    return !!vote
  }
}
