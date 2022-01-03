import { Worker as JadlWorker } from 'jadl'

import { CommandHandler } from '@jadl/cmd'

import { Embed } from '@jadl/embed'

import { Config } from '../Config'
import { Database } from '../Database'
import { ImageAPI } from '../ImageApi'
import { Utils } from '../Utils'
import { LevelingHandler } from '../LevelingHandler'

import { WorkerEvents } from '../../events/WorkerEvents'

import { ColorCommand } from '../../commands/leveling/ColorCommand'
import { CooldownCommand } from '../../commands/leveling/CooldownCommand'
import { LeaderboardCommand } from '../../commands/leveling/LeaderboardCommand'
import { LevelRoleCommand } from '../../commands/leveling/LevelRoleCommand'
import { MultiplierCommand } from '../../commands/leveling/MultiplierCommand'
import { RankCommand } from '../../commands/leveling/RankCommand'
import { SetLevelMessageCommand } from '../../commands/leveling/SetLevelMessageCommand'
import { TagCommand } from '../../commands/leveling/TagCommand'
import { ToggleLevelMessageCommand } from '../../commands/leveling/ToggleLevelMessageCommand'

import { InviteCommand } from '../../commands/misc/InviteCommand'
import { PingCommand } from '../../commands/misc/PingCommand'
import { StatsCommand } from '../../commands/misc/StatsCommand'
import { SupportCommand } from '../../commands/misc/SupportCommand'
import { Requests } from '../Requests'

export class Worker extends JadlWorker {
  config = Config

  db = new Database()
  imageAPI = new ImageAPI(this)
  leveling = new LevelingHandler(this)
  requests = new Requests(this.api)

  cmd = new CommandHandler(
    this,
    [
      InviteCommand,
      PingCommand,
      StatsCommand,
      SupportCommand,
      ColorCommand,
      CooldownCommand,
      LeaderboardCommand,
      LevelRoleCommand,
      MultiplierCommand,
      RankCommand,
      SetLevelMessageCommand,
      TagCommand,
      ToggleLevelMessageCommand
    ],
    {
      interactionGuild: this.config.discord.test_guild
    }
  )

  utils = Utils

  workerEvents = new WorkerEvents(this)

  constructor () {
    super()

    this.workerEvents.add(this)

    this.api.on('restDebug', this.debug.bind(this))
  }

  webhook (wh: keyof typeof Config.discord.webhooks): Embed | null {
    if (process.env.NODE_ENV !== 'production') return null

    const webhook = this.config.discord.webhooks[wh]
    if (!webhook) throw new Error('Webhook not found')
    return new Embed(async (embed) => {
      return await this.requests.sendWebhookMessage(webhook.id, webhook.token, { embeds: [embed.render()] })
    })
  }
}
