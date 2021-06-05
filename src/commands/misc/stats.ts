import { Snowflake } from 'discord-api-types'
import { CommandOptions } from '../../structures/CommandHandler'
import { getAvatar } from '../../utils'

interface Stats {
  id: Snowflake
  shards: ShardStat[]
  guilds: number
  channels: number
  roles: number
}

export default {
  command: 'stats',
  category: 'misc',
  locale: 'STATS',
  cooldown: {
    time: 5e3
  },
  exec: async (ctx) => {
    const currentShard = Number((BigInt(ctx.id) >> BigInt(22)) % BigInt(ctx.worker.options.shards))

    const stats = await ctx.worker.comms.broadcastEval(
      `const stats = {
        id: worker.comms.id,
        shards: worker.shardStats,
        guilds: worker.guilds.size,
        channels: worker.channels.size,
        roles: worker.guildRoles.reduce((a, b) => a + b.size, 0)
      }; stats`
    ) as unknown as Stats[]

    const url = getAvatar(ctx.message.author)

    const embed = ctx.embed
      .author(ctx.message.author.username + ' | ' + await ctx.lang('CMD_STATS_NAME'), url)
      .color(ctx.worker.colors.PURPLE)
      .description(
        `\`\`\`properties
Cluster: ${ctx.worker.comms.id} / ${stats.length}
Shard: ${currentShard} / ${stats.reduce((a, shard) => a + Object.keys(shard).length, 0)}
Memory: ${ctx.worker.mem.heapUsed}
\`\`\``
      )

    for (const cluster of stats) {
      embed.field(`Cluster ${cluster.id}`, `\`\`\`properties
Shards: ${Object.keys(cluster.shards).length}
Guilds: ${cluster.guilds.toLocaleString()}
Channels: ${cluster.channels.toLocaleString()}
Roles: ${cluster.roles.toLocaleString()}
\`\`\``, true)
    }

    await embed.send(true)
    return true
  }
} as CommandOptions<boolean>
