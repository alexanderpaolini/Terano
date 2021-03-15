import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Restart',
  usage: 'restart',
  description: 'Restart the bot.',
  category: 'owner',
  command: 'restart',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    if (typeof ctx.flags.shard !== 'undefined') {
      const shard = parseInt(String(ctx.flags.shard));

      if (shard >= (ctx.worker.options.shards as number))
        return ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Shard ${ctx.flags.shard} does not exist.`);
    
      await ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Restarting Shard ${shard}`);
      ctx.worker.comms.restartShard(shard);
    } else if (typeof ctx.flags.cluster !== 'undefined') {
      const cluster = parseInt(String(ctx.flags.cluster));

      if (isNaN(cluster) || cluster >= Math.ceil((ctx.worker.options.shards as number) / (ctx.worker.options.shardsPerCluster || 5)))
        return ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Cluster ${ctx.flags.cluster} does not exist.`);

      await ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `Restarting Cluster ${cluster}`);
      ctx.worker.comms.restartCluster(cluster.toString());
    } else {
      await ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, 'Restarting...');
      
      const maxClusters = Math.ceil((ctx.worker.options.shards as number) / (ctx.worker.options.shardsPerCluster || 5));
      for (let i = 0; i < maxClusters; i++) {
        ctx.worker.comms.restartCluster(i.toString());
      }
    }
    return;
  }
} as CommandOptions;
