import { CommandOptions } from 'discord-rose'

export default {
  command: 'restart',
  category: 'owner',
  locale: 'RESTART',
  owner: true,
  exec: async (ctx) => {
    if (typeof ctx.flags.shard !== 'undefined') {
      const shard = parseInt(String(ctx.flags.shard))

      if (shard >= (ctx.worker.options.shards)) {
        await ctx.respond('CMD_RESTART_NOSHARD', { error: true }, String(ctx.flags.shard))
        return false
      }

      await ctx.respond('CMD_RESTART_SHARD', {}, String(shard))
      ctx.worker.comms.restartShard(shard)
    } else if (typeof ctx.flags.cluster !== 'undefined') {
      const cluster = parseInt(String(ctx.flags.cluster))

      if (isNaN(cluster) || cluster >= Math.ceil((ctx.worker.options.shards) / (ctx.worker.options.shardsPerCluster ?? 5))) {
        await ctx.respond('CMD_RESTART_NOCLUSTER', { error: true }, String(ctx.flags.cluster))
        return false
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
    return true
  }
} as CommandOptions<boolean>
