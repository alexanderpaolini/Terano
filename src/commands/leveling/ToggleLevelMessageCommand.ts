import { Author, Command, Worker as GetWorker, Guild, MessageTypes, Run, UserPerms } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('togglelevelmessage', 'Toggle the level-up message')
export class ToggleLevelMessageCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    const sendMesasge = !(await worker.db.guilds.getSendLevelMessage(guild.id))
    await worker.db.guilds.setSendLevelMessage(guild.id, sendMesasge)

    return new Embed()
      .author(
        `${author.username} | Tag`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Level-Up messages \`${sendMesasge ? 'enabled' : 'disabled'}\``)
  }
}
