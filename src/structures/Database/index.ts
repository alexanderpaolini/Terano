import mongoose from 'mongoose'
import { Config } from '../Config'
import { GuildDb } from './GuildDb'
import { UserDb } from './UserDb'

export class Database {
  guilds = new GuildDb()
  users = new UserDb()

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

export { GuildDb, UserDb }
