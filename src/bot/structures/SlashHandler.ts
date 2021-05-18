import { APIApplicationCommand, APIApplicationCommandInteraction } from 'discord-api-types'

import { Worker } from 'discord-rose/dist/typings/lib'

import Collection from '@discordjs/collection'

export interface SlashCommand extends Omit<APIApplicationCommand, 'id' | 'application_id'> {
  exec: (worker: Worker, data: APIApplicationCommandInteraction) => Promise<void> | void
}

export class SlashHandler {
  commands = new Collection<string, SlashCommand>()

  constructor (private readonly worker: Worker) {
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
      await command.exec(this.worker, data)
    })
  }

  add (command: SlashCommand): this {
    this.commands.set(command.name, command)

    return this
  }
}
