import { APIGuild, APIGuildMember, APIUser, MessageFlags, Snowflake } from 'discord-api-types'

import { Command, Options, Thinks, Worker as GetWorker, Run, Guild, Author, Member, FileBuilder, MessageTypes } from '@jadl/cmd'

import { Worker } from '../../structures/Bot'

@Command('rank', 'View your or another person\'s rank')
export class RankCommand {
  @Run()
  @Thinks()
  async exec (
    @Options.User('user', 'The user') u: Snowflake | undefined,
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser,
    @Member() member: APIGuildMember,
    @Options.Boolean('ephemeral', 'Whether or not to send as ephemeral') ephemeral: boolean
  ): Promise<MessageTypes> {
    const userId = u ?? author.id
    member = await worker.api.members.get(guild.id, userId).catch(() => null) ?? member

    const user = member.user!

    const userOptions = await worker.db.users.getSettings(user.id)
    const userData = await worker.db.users.getLevel(user.id, guild.id)

    const buffer = await worker.imageAPI.card({
      color: userOptions.level.color || await worker.db.guilds.getDefaultLevelColor(guild.id),
      level: userData.level,
      maxxp: Math.floor(100 + 5 / 6 * userData.level * (2 * userData.level * userData.level + 27 * userData.level + 91)),
      picture: userOptions.level.picture || worker.utils.getGuildAvatar(member, guild.id, 'png', 256),
      tag: userOptions.level.tag,
      usertag: `${user.username}#${user.discriminator}`,
      xp: userData.xp
    })

    return new FileBuilder()
      .add('rank.png', buffer)
      .extra({
        flags: ephemeral ? MessageFlags.Ephemeral : undefined
      })
  }
}
