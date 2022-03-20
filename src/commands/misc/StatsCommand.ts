import { Author, Command, Guild, MessageTypes, Run, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser, Snowflake } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

interface ShardStat {
  guilds: number
  channels: number
  roles: number
  ping: string
}

export interface Stats {
  id: Snowflake
  shards: ShardStat[]
  guilds: number
  channels: number
  roles: number
}

@Command('stats', 'View bot stats')
export class StatsCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker,
    @Guild() guild: APIGuild,
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    const currentShard = guild
      ? Number((BigInt(guild.id) >> BigInt(22)) % BigInt(worker.options.shards))
      : 1

    const stats = await worker.comms.broadcastEval(
      `const stats = {
          id: worker.comms.id,
          shards: worker.shards.reduce((a, shard) => {
            a[shard.id] = worker.guilds.reduce((b, guild) => {
              if (Number((BigInt(guild.id) >> BigInt(22)) % BigInt(worker.options.shards)) !== shard.id) return b
              return {
                ping: (worker.shards.get(shard.id)?.ping ?? '?').toString(),
                guilds: b.guilds + 1,
                roles: b.roles + (worker.guildRoles.get(guild.id)?.size ?? 0)
              }
            }, { ping: '', guilds: 0, channels: 0, roles: 0 })
            return a
          }, {}),
          guilds: worker.guilds.size,
          roles: worker.guildRoles.reduce((a, b) => a + b.size, 0)
        }; stats`
    ) as unknown as Stats[]

    const embed = new Embed()
      .author(
        author.username + ' | Stats',
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.PURPLE)
      .description(
        '```properties\n' +
        `Cluster: ${Number(worker.comms.id) + 1} / ${stats.length}\n` +
        `Shard: ${currentShard + 1} / ${stats.reduce((a, cluster) => a + Object.keys(cluster.shards).length, 0)}\n` +
        `Memory: ${worker.utils.mem.heapUsed}\n` +
        '```'
      )

    for (const cluster of stats) {
      embed.field(
        `Cluster ${cluster.id}`,
        '```properties\n' +
        `Shards: ${Object.keys(cluster.shards).length}\n` +
        `Guilds: ${(cluster.guilds ?? '0').toLocaleString()}\n` +
        `Channels: ${(cluster.channels ?? '0').toLocaleString()}\n` +
        `Roles: ${(cluster.roles ?? '0').toLocaleString()}\n` +
        '```',
        true
      )
    }

    return embed
  }
}
