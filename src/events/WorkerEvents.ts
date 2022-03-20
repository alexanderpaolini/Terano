import { Event, ExtendedEmitter } from '@jpbberry/typed-emitter'
import { DiscordEventMap } from 'jadl'
import { Worker } from '../structures/Bot/Worker'

export class WorkerEvents extends ExtendedEmitter {
  constructor (private readonly worker: Worker) {
    super()
  }

  @Event('GUILD_CREATE')
  async guildCreate (guild: DiscordEventMap['GUILD_CREATE']): Promise<void> {
    this.worker.log(`Joined Guild ${guild.name} (${guild.id})`)

    await this.worker.db.guilds.createGuild(guild.id)

    await this.worker.webhook('guilds')
      ?.title('Joined Guild')
      .author(
        `${this.worker.user.username}#${this.worker.user.discriminator}`,
        'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png'
      )
      .color(this.worker.config.colors.GREEN)
      .description(`\`${guild.name}\` (${guild.id})`)
      .footer(`Current Guild Count: ${this.worker.guilds.size}`)
      .send()
  }

  @Event('GUILD_DELETE')
  async guildDelete (guild: DiscordEventMap['GUILD_DELETE']): Promise<void> {
    this.worker.log(`Left Guild ${guild.id}`)

    await this.worker.webhook('guilds')
      ?.title('Left Guild')
      .author(
        `${this.worker.user.username}#${this.worker.user.discriminator}`,
        'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png'
      )
      .color(this.worker.config.colors.RED)
      .description(`${guild.id}`)
      .footer(`Current Guild Count: ${this.worker.guilds.size}`)
      .send()
  }

  @Event('READY')
  async ready (): Promise<void> {
    this.worker.log(`Ready as ${this.worker.user.username}#${this.worker.user.discriminator} (${this.worker.user.id})`)
  }

  @Event('SHARD_READY')
  async shardReady (shard: DiscordEventMap['SHARD_READY']): Promise<void> {
    await this.worker.webhook('shards')
      ?.title(`Cluster ${this.worker.comms.id}`)
      .author(`${this.worker.user.username}#${this.worker.user.discriminator}`)
      .description(`Shard ${shard.id} is ready`)
      .color(this.worker.config.colors.GREEN)
      .send()
  }
}
