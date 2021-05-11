import TeranoWorker from './bot/structures/TeranoWorker'
import TeranoContext from './bot/structures/CommandContext'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions {
    name: string
    description: string
    usage: string
    category: string
    owner?: boolean
    disabled?: boolean
    cooldown?: number
  }

  interface CommandContext extends TeranoContext { }

  interface worker extends TeranoWorker { }
}
