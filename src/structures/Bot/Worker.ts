import * as Rose from 'discord-rose'

import { Config } from '../Config'
import { Database } from '../Database'
import { ImageAPI } from '../ImageApi'
import { Utils } from '../Utils'
import { LevelingHandler } from '../LevelingHandler'

export class Worker extends Rose.Worker {
  config = Config

  db = new Database()
  imageAPI = new ImageAPI(this)
  leveling = new LevelingHandler(this)

  utils = Utils

  webhook (wh: keyof typeof Config.discord.webhooks): Rose.Embed {
    const webhook = this.config.discord.webhooks[wh]
    if (!webhook) throw new Error('Webhook not found')
    return new Rose.Embed(async (embed) => {
      return await this.api.webhooks.send(webhook.id, webhook.token, embed)
    })
  }
}
