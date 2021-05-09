import { Snowflake } from 'discord-api-types'
import { bits } from 'discord-rose/dist/utils/Permissions'

import TeranoWorker from './bot/structures/TeranoWorker'
import TeranoContext from './bot/structures/CommandContext'

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

  interface CommandContext extends TeranoContext { }

  type worker = TeranoWorker
}

declare module 'discord-rose/dist/clustering/ThreadComms' {
  interface ThreadEvents {
    INFLUX_VOTE: {
      send: Snowflake
      receive: null
    }
  }
}
