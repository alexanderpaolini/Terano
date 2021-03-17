import config from '../../config.json'

import { Router } from 'express'

import { Webhook } from '@top-gg/sdk'
import { Snowflake } from 'discord-api-types'

const router = Router()
const webhook = new Webhook(config.topgg.webhook.auth)

router.use(webhook.middleware())

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/vote', async (req, res) => {
  if ((req.vote == null) || !req.vote.user) return res.status(400).json({ success: false })

  const user = await req.app.comms.sendCommand('FETCH_USER', req.vote.user as Snowflake)

  const votes = await req.app.VoteDB.getVotes(req.vote.user)

  await req.app.VoteDB.addVote(req.vote.user, {
    bot: req.vote.bot ?? 'none',
    date: new Date().toString(),
    worth: req.vote.isWeekend ? 2 : 1,
    query: req.vote.query
  })

  await req.app.comms.sendWebhook(config.webhooks.votes.id as `${bigint}`, config.webhooks.votes.token, {
    embeds: [{
      title: 'User Voted',
      author: {
        name: req.vote.type === 'test' ? 'Test DBL Vote Webhook' : 'DBL Vote Webhook',
        icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813585465169018880/image0.png'
      },
      color: req.vote.type === 'test' ? 16711680 : 11946475,
      description: `\`${user.username}#${user.discriminator}\` just voted!`,
      footer: {
        text: `They have voted ${votes.total_votes} time${votes.total_votes > 1 ? 's' : ''}!`
      }
    }]
  })

  res.json({ success: true })
})

export default router
