import { APIUser, Snowflake } from 'discord-api-types'
import { bits } from 'discord-rose/dist/utils/Permissions'
import TeranoWorker from './bot/lib/TeranoWorker'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions {
    name: string
    description: string
    usage: string
    category: string
    permissions?: Array<keyof typeof bits>
    botPermissions?: Array<keyof typeof bits>
    owner?: boolean
    disabled?: boolean
    cooldown?: number
  }

  interface CommandContext {
    invokeCooldown: () => void
  }

  type worker = TeranoWorker
}

declare module 'discord-rose/dist/clustering/ThreadComms' {
  interface ThreadEvents {
    FETCH_USER: {
      send: Snowflake
      receive: APIUser
    }
  }
}
