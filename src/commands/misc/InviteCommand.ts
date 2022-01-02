import { Command, Worker as GetWorker, Run, MessageTypes } from '@jadl/cmd'

import { Worker } from '../../structures/Bot'

@Command('invite', 'Get the bot\'s invite link')
export class InviteCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker
  ): Promise<MessageTypes> {
    return (
      'My Invite Link:\n' +
      `<https://discord.com/oauth2/authorize?client_id=${worker.user.id}&permissions=8&scope=bot%20applications.commands>`
    )
  }
}
