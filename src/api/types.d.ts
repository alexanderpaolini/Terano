import { Thread } from 'discord-rose'
import VoteDB from '../database/vote'

declare global {
  namespace Express {
    interface Application {
      comms: Thread
      VoteDB: VoteDB
    }
  }
}
