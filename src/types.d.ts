import TeranoWorker from './bot/structures/TeranoWorker'
import { CommandContext as TeranoContext } from './bot/structures/CommandContext'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandContext extends TeranoContext {}

  interface worker extends TeranoWorker {}
}
