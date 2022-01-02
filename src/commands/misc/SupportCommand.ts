import { Command, Worker as GetWorker, Run, MessageTypes } from '@jadl/cmd'

import { Worker } from '../../structures/Bot'

@Command('support', 'Get the bot\'s support server link')
export class SupportCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker
  ): Promise<MessageTypes> {
    return (
      'My Support Server:\n' +
      `<https://discord.gg/${worker.config.discord.invite}>`
    )
  }
}
