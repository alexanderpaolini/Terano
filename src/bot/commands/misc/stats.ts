import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../../utils'

export default {
  name: 'Stats',
  usage: 'stats',
  description: 'Get the bot\'s stats.',
  category: 'misc',
  command: 'stats',
  userPerms: [],
  myPerms: [],
  owner: false,
  cooldown: 5e3,
  exec: async (ctx) => {
    const currentShard = Number((BigInt(ctx.getID) >> BigInt(22)) % BigInt(ctx.worker.options.shards))

    const stats = await ctx.worker.comms.broadcastEval('const shit = { id: worker.comms.id, shards: worker.shardStats, memory: worker.mem, guilds: worker.guilds.size, channels: worker.channels.size, roles: worker.guildRoles.reduce((a, b) => a + b.size, 0) }; shit;')

    const url = getAvatar(ctx.message.author)

    const embed = ctx.embed
      .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
      .color(ctx.worker.colors.PURPLE)

    for (const cluster of stats) {
      embed.field(`Cluster ${cluster.id as number}`, `\`\`\`properties
Shards: ${Object.keys(cluster.shards).length}
Memory: ${cluster.memory.heapUsed as number}
Guilds: ${cluster.guilds.toLocaleString() as string}
  Channels: ${cluster.channels.toLocaleString() as string}
  Roles: ${cluster.roles.toLocaleString() as string}

${Object.entries(cluster.shards).map((S: any) => `Shard ${S[0] as number}
  Guilds: ${S[1].guilds as number}
  Latency: ${S[1].ping as number}ms
`).join('\n')}
\`\`\``, true)
    }

    embed.description(`\`\`\`properties
Current
  Cluster: ${ctx.worker.comms.id}
  Shard: ${currentShard}
\`\`\``)

    embed.send(true)
      .catch(() => {

      })

    if (ctx.invokeCooldown) ctx.invokeCooldown()
  }
} as CommandOptions
