import { Author, Command, Worker as GetWorker, Guild, MessageTypes, Options, Run, UserPerms } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('cooldown', 'Set the XP cooldown')
export class CooldownCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.Integer('seconds', 'The delay in seconds', { required: true }) delay: number,
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    await worker.db.guilds.setXPCooldown(guild.id, delay)

    return new Embed()
      .author(
        `${author.username} | Cooldown`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`XP cooldown set to \`${delay}s\``)
  }
}
