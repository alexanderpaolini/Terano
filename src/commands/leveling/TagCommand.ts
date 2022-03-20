import { Author, Command, MessageTypes, Options, Run, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('tag', 'The display tag')
export class TagCommand {
  @Run()
  async exec (
    @Options.String('tag', 'The display tag', { required: true }) tag: string,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    if (tag.length > 30) {
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Tag`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.GREEN)
        .description('Tag must be no longer than thirty (30) characters')
    }

    await worker.db.users.setTag(author.id, tag)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Tag`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Rank card tag set to \`${tag}\``)
  }
}
