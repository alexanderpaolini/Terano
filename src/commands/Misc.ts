import { Command, Thinks, GetWorker, Run, Guild, Author } from '@jadl/cmd'

import { Embed } from '@jadl/embed'

import { APIGuild, APIUser, Snowflake } from 'discord-api-types'

import { Worker } from '../structures/Bot'

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

@Command('invite', 'Get the bot\'s invite link')
export class InviteCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker
  ) {
    return (
      'My Invite Link:\n' +
      `<https://discord.com/oauth2/authorize?client_id=${worker.user.id}&permissions=8&scope=bot%20applications.commands>`
    )
  }
}

@Command('ping', 'View the bot\'s ping')
export class PingCommand {
  @Run()
  @Thinks()
  async exec (
    @GetWorker() worker: Worker
  ) {
    return new Embed()
      .author(
        `Pong! (???ms)`,
        worker.utils.getAvatar(worker.user)
      )
      .color(worker.config.colors.PURPLE)
  }
}

@Command('stats', 'View bot stats')
export class StatsCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker,
    @Guild() guild: APIGuild,
    @Author() author: APIUser
  ) {
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

@Command('support', 'Get the bot\'s support server link')
export class SupportCommand {
  @Run()
  async exec (
    @GetWorker() worker: Worker
  ) {
    return (
      'My Support Server:\n' +
      `<https://discord.gg/${worker.config.discord.invite}>`
    )
  }
}
