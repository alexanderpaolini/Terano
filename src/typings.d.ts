import { Worker as NewWorker } from './structures/Bot'

import { CommandContext as NewContext } from './structures/CommandContext'

declare module 'discord-rose/dist/typings/lib' {
  type worker = NewWorker

  interface CommandContext extends NewContext { }

  interface CommandOptions extends CommandOptions {
    description: string
    category: string
    usage: string
    name: string

    disabled?: boolean

    interactionOnly?: boolean
    guildOnly?: boolean
    ownerOnly?: boolean
  }
}
