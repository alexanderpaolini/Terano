import { Snowflake } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

interface ShardStat {
  guilds: number
  channels: number
  roles: number
  ping: string
}

interface Stats {
  id: Snowflake
  shards: ShardStat[]
  guilds: number
  channels: number
  roles: number
}

export default <CommandOptions>{
  name: 'Stats',
  command: 'stats',
  description: 'View bot stats',
  category: 'Misc',
  usage: '',
  interaction: {
    name: 'stats',
    description: 'View bot stats'
  },
  interactionOnly: true,
  myPerms: ['embed'],
  exec: async (ctx) => {
    const currentShard = ctx.guild
      ? Number((BigInt(ctx.guild.id) >> BigInt(22)) % BigInt(ctx.worker.options.shards))
      : 1

    const stats = await ctx.worker.comms.broadcastEval(
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

    const embed = ctx.embed
      .author(
        ctx.author.username + ' | Stats',
        ctx.worker.utils.getAvatar(ctx.author)
      )
      .color(ctx.worker.config.colors.PURPLE)
      .description(
        '```properties\n' +
        `Cluster: ${Number(ctx.worker.comms.id) + 1} / ${stats.length}\n` +
        `Shard: ${currentShard + 1} / ${stats.reduce((a, cluster) => a + Object.keys(cluster.shards).length, 0)}\n` +
        `Memory: ${ctx.worker.utils.mem.heapUsed}\n` +
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

    await embed.send(true)
  }
}
