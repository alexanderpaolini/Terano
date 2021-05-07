import { Thread, RestManager } from 'discord-rose'
import { OAuth2 } from './structures/OAuth2'
import VoteDB from '../database/vote'

declare global {
  namespace Express {
    interface Application {
      comms: Thread
      VoteDB: VoteDB
      api: RestManager
      oauth2: OAuth2
    }
  }
}
