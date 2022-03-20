import { Author, Command, Guild, MessageTypes, Options, Run, UserPerms, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('setlevelmessage', 'Set the level-up message')
export class SetLevelMessageCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.String('message', 'The level-up message', { required: true }) message: string,
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    await worker.db.guilds.setLevelMessage(guild.id, message)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Set Level-Up Message`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Level-up message set to \`${message}\``)
  }
}
