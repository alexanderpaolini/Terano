import config from '../../config.json'

import { Router } from 'express'

import { Webhook } from '@top-gg/sdk'
import { Snowflake } from 'discord-rose'

const router = Router()
const webhook = new Webhook(config.topgg.webhook.auth)

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

  await req.app.comms.sendWebhook(config.webhooks.votes.id as any, config.webhooks.votes.token, {
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

  res.json({ success: true })
}))

export default router
