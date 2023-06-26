import { Author, Command, Worker as GetWorker, MessageTypes, Options, Run } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('color', 'Set your rank card accent color')
export class ColorCommand {
  @Run()
  async exec (
    @Options.String('color', 'The accent color', { required: true }) color: string,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    await worker.db.users.setColor(author.id, color)

    return new Embed()
      .author(
        `${author.username} | Color`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Rank card color set to \`${color}\``)
  }
}
