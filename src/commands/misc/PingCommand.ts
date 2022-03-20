import { Command, MessageTypes, Run, Thinks, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { Worker } from '../../structures/Bot'

@Command('ping', 'View the bot\'s ping')
export class PingCommand {
  @Run()
  @Thinks()
  async exec (
    @GetWorker() worker: Worker
  ): Promise<MessageTypes> {
    return new Embed()
      .author(
        'Pong! (???ms)',
        worker.utils.getAvatar(worker.user)
      )
      .color(worker.config.colors.PURPLE)
  }
}
