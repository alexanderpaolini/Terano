import { Command, FileBuilder, Worker as GetWorker, Guild, MessageTypes, Options, Run, Thinks } from '@jadl/cmd'
import { APIGuild } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('leaderboard', 'View the top ranks')
export class LeaderboardCommand {
  @Run()
  @Thinks()
  async exec (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Options.Boolean('ephemeral', 'Whether or not to send as ephemeral') ephemeral: boolean
  ): Promise<MessageTypes> {
    const allLevels = (await worker.db.users.getAllLevels(guild.id))
      .sort((a, b) => {
        if (a.level !== b.level) { return (b.level - a.level) } else { return (b.xp - a.xp) }
      })

    const newDataArr = []

    for (const levelData of allLevels) {
      if (newDataArr.length === 8) { continue }

      const member = await worker.requests.getMember(guild.id, levelData.user_id).catch(() => null)
      if (!member) { continue }

      const user = member.user!
      newDataArr.push({
        tag: user.global_name || user.username,
        pfp: worker.utils.getGuildAvatar(member, guild.id),
        level: levelData.level,
        rank: Number(allLevels.indexOf(levelData)) + 1
      })

      const buffer = await worker.imageAPI.leaderboard(newDataArr)
      return new FileBuilder()
        .add('leaderboard.png', buffer)
        .extra({
          flags: ephemeral ? 64 : undefined
        })
    }
  }
}
