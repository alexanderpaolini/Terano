import { APIApplicationCommand } from 'discord-api-types'

import Collection from '@discordjs/collection'
import { EventEmitter } from '@jpbberry/typed-emitter'

import TeranoWorker from './TeranoWorker'
import { SlashContext } from './SlashContext'

export interface SlashCommand extends Omit<APIApplicationCommand, 'id' | 'application_id'> {
  exec: (ctx: SlashContext) => Promise<void> | void
}

/**
 * Command Events
 */
export interface HandlerEvents {
  COMMAND_RAN: [SlashContext, any]
}

export class SlashHandler extends EventEmitter<HandlerEvents> {
  /**
   * Collection holding all of the commands
   */
  commands = new Collection<string, SlashCommand>()

  constructor (private readonly worker: TeranoWorker) {
    super()

    this.worker.on('READY', () => {
      const interactions: Array<Partial<SlashCommand>> = []

      this.commands.forEach(c => {
        const cmd: Partial<SlashCommand> = { ...c }
        delete cmd.exec
        interactions.push(cmd)
      })

      if (this.worker.prod) {
        void this.worker.api.request('PUT', `/applications/${this.worker.user.id}/commands`, {
          body: interactions
        })
      } else {
        void this.worker.api.request('PUT', `/applications/${this.worker.user.id}/guilds/${this.worker.config.discord.test_guild}/commands`, {
          body: interactions
        })
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.worker.on('INTERACTION_CREATE', async (data) => {
      const command = this.commands.get(data.data.name)
      if (!command) return
      if (!('member' in data)) return
      const ctx = new SlashContext({
        worker: this.worker,
        command: command,
        interaction: data
      })
      await command.exec(ctx)
    })
  }

  /**
   * Add a slash command to the handler
   * @param command Slash command to be added
   */
  add (command: SlashCommand): this {
    this.commands.set(command.name, command)

    return this
  }
}
