import { APIGuild, APIUser } from 'discord-api-types'

import { Command, Worker as GetWorker, Run, Guild, UserPerms, Author, MessageTypes } from '@jadl/cmd'
import { Embed } from '@jadl/embed'

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
        `${author.username}#${author.discriminator} | Tag`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Level-Up messages \`${sendMesasge ? 'enabled' : 'disabled'}\``)
  }
}
