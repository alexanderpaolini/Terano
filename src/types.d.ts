import TeranoWorker from './structures/TeranoWorker'
import { CommandContext as TeranoContext } from './structures/CommandContext'

declare module 'discord-rose/dist/typings/lib' {
  interface CommandContext extends TeranoContext {}

  interface worker extends TeranoWorker {}
}
