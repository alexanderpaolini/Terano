import mongoose from 'mongoose'

import { Config } from '../Config'

import { GuildDB } from './GuildDB'
import { UserDB } from './UserDB'
import { VoteDB } from './VoteDB'

export class Database {
  guilds = new GuildDB()
  users = new UserDB()
  votes = new VoteDB()

  constructor () {
    mongoose.connect(Config.db.connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      .catch(console.error)
  }
}

export { GuildDB, UserDB, VoteDB }
