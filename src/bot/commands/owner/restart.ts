import { CommandOptions } from 'discord-rose'

export default {
  name: 'Restart',
  usage: 'restart',
  description: 'Restart the bot.',
  category: 'owner',
  command: 'restart',
  aliases: [],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    if (typeof ctx.flags.shard !== 'undefined') {
      const shard = parseInt(String(ctx.flags.shard))

      if (shard >= (ctx.worker.options.shards)) return await ctx.respond('CMD_RESTART_NOSHARD', { error: true }, String(ctx.flags.shard))

      await ctx.respond('CMD_RESTART_SHARD', {}, String(shard))
      ctx.worker.comms.restartShard(shard)
    } else if (typeof ctx.flags.cluster !== 'undefined') {
      const cluster = parseInt(String(ctx.flags.cluster))

      if (isNaN(cluster) || cluster >= Math.ceil((ctx.worker.options.shards) / (ctx.worker.options.shardsPerCluster ?? 5))) {
        return await ctx.respond('CMD_RESTART_NOCLUSTER', {}, String(ctx.flags.cluster))
      }

      await ctx.respond('CMD_RESTART_CLUSTER', {}, String(cluster))
      ctx.worker.comms.restartCluster(cluster.toString())
    } else {
      await ctx.respond('CMD_RESTART_ALL', { color: ctx.worker.colors.ORANGE })

      const maxClusters = Math.ceil((ctx.worker.options.shards) / (ctx.worker.options.shardsPerCluster ?? 5))
      for (let i = 0; i < maxClusters; i++) {
        ctx.worker.comms.restartCluster(i.toString())
      }
    }
  }
} as CommandOptions
