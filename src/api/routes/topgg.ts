import { Config } from '../../config'

import { Snowflake } from 'discord-api-types'
import { Router } from 'express'
import { Webhook } from '@top-gg/sdk'
import { API } from '../structures/API'

export default function (this: API, router: Router): void {
  const webhook = new Webhook(Config.topgg.webhook_auth)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/vote', webhook.listener(async (vote, req, res) => {
    if (!req || !res) return

    const user = await req.app.api.users.get(vote.user as Snowflake)

    if (!user) return

    const votes = await req.app.VoteDB.getVotes(vote.user)

    await req.app.VoteDB.addVote(vote.user, {
      bot: vote.bot ?? 'none',
      date: new Date().toString(),
      worth: vote.isWeekend ? 2 : 1,
      query: vote.query
    })

    if (Config.discord.webhooks?.votes) {
      await req.app.comms.sendWebhook(Config.discord.webhooks.votes.id as any, Config.discord.webhooks.votes.token, {
        embeds: [{
          title: 'User Voted',
          author: {
            name: vote.type === 'test' ? 'Test DBL Vote Webhook' : 'DBL Vote Webhook',
            icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813585465169018880/image0.png'
          },
          color: vote.type === 'test' ? 16711680 : 11946475,
          description: `\`${user.username}#${user.discriminator}\` just voted!`,
          footer: {
            text: `They have voted ${votes.total_votes} time${votes.total_votes > 1 ? 's' : ''}!`
          }
        }]
      })
    }

    res.json({ success: true })
  }))
}
