import { Config } from '../config'

import mongoose from 'mongoose'

import TeranoWorker from '../structures/TeranoWorker'

import GuildDB from './guild'
import OAuth2DB from './oauth2'
import UserDB from './user'
import VoteDB from './vote'

export class Database {
  voteDB = new VoteDB()
  guildDB = new GuildDB()
  userDB = new UserDB()
  Oauth2DB = new OAuth2DB()

  constructor (worker?: TeranoWorker) {
    mongoose.connect(Config.db.connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      .then(() => worker?.log('Connected to MongoDB'))
      .catch(worker?.log)
  }
}

export { GuildDB, OAuth2DB, UserDB, VoteDB }
