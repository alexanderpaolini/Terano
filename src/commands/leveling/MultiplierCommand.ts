import { Author, Command, Guild, MessageTypes, Options, Run, UserPerms, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('multiplier', 'Change the XP multiplier')
export class MultiplierCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.Integer('multiplier', 'The XP multiplier', { required: true }) multiplier: number,
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    if (multiplier <= 0 || multiplier > 100) {
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Multiplier`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.RED)
        .description('The XP multiplier must be greater than 0 and less than 100')
    }

    await worker.db.guilds.setXPMultiplier(guild.id, multiplier)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Multiplier`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`XP multiplier set to \`${multiplier}x\``)
  }
}
