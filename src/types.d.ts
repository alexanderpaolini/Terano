import TeranoWorker from './bot/structures/TeranoWorker'
import { CommandContext as TeranoContext } from './bot/structures/CommandContext'

import { CommandError } from 'discord-rose/dist/typings/lib'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions<K> {
    onRun?: (ctx: CommandContext, response: K) => any | Promise<any>
    onError?: (ctx: CommandContext, response: CommandError) => any | Promise<any>
    exec: (ctx: CommandContext) => K | Promise<K>
    locale: string
    category: string
    owner?: boolean
    disabled?: boolean
    cooldown?: number
  }

  interface CommandContext extends TeranoContext { }

  interface worker extends TeranoWorker {}
}
