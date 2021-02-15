import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Stats',
  usage: 'stats',
  description: 'Get the bot\'s stats.',
  category: 'misc',
  command: 'stats',
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {

    const currentShard = Number((BigInt(ctx.guild.id) >> BigInt(22)) % BigInt(ctx.worker.options.shards));

    const stats = await ctx.worker.comms.broadcastEval("const shit = { id: worker.comms.id, shards: worker.shardStats, memory: worker.mem, guilds: worker.guilds.size, channels: worker.channels.size, roles: worker.guildRoles.reduce((a, b) => a + b.size, 0) }; shit;");

    const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`;

    const embed = ctx.embed
      .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
      .color(ctx.worker.colors.PURPLE);

    for (const cluster of stats) {
      embed.field(`Cluster ${cluster.id}`, `\`\`\`properties
Shards: ${Object.keys(cluster.shards).length}
Memory: ${cluster.memory.heapUsed}
Guilds: ${cluster.guilds.toLocaleString()}
  Channels: ${cluster.channels.toLocaleString()}
  Roles: ${cluster.roles.toLocaleString()}

${Object.entries(cluster.shards).map((S: any) => `Shard ${S[0]}
  Guilds: ${S[1].guilds}
  Ping: ${S[1].ping}ms
`).join('\n')}
\`\`\``, true);
    }

    embed.description(`\`\`\`properties
Current
  Cluster: ${ctx.worker.comms.id}
  Shard: ${currentShard}
\`\`\``);

    embed.send(true);
  }
} as CommandOptions;
