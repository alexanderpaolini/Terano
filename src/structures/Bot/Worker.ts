import * as Jadl from 'jadl'

import { CommandHandler } from '@jadl/cmd'

import { Embed } from '@jadl/embed'

import { Config } from '../Config'
import { Database } from '../Database'
import { ImageAPI } from '../ImageApi'
import { Utils } from '../Utils'
import { LevelingHandler } from '../LevelingHandler'

import {
  InviteCommand,
  PingCommand,
  StatsCommand,
  SupportCommand,
  ColorCommand,
  CooldownCommand,
  LeaderboardCommand,
  MultiplierCommand,
  RankCommand,
  SetLevelMessageCommand,
  TagCommand,
  ToggleLevelMessageCommand,
  LevelRoleCommand
} from '../../commands'

export class Worker extends Jadl.Worker {
  config = Config

  db = new Database()
  imageAPI = new ImageAPI(this)
  leveling = new LevelingHandler(this)
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

  webhook (wh: keyof typeof Config.discord.webhooks): Embed {
    const webhook = this.config.discord.webhooks[wh]
    if (!webhook) throw new Error('Webhook not found')
    return new Embed(async (embed) => {
      return await this.api.webhooks.send(webhook.id, webhook.token, embed)
    })
  }
}
