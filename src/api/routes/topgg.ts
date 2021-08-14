import { Router } from 'express'

import { Webhook } from '@top-gg/sdk'

import { Api } from '../../structures/Api'
import { Embed } from 'discord-rose'

export default function (this: Api, router: Router): void {
  if (!this.config.topgg) return

  const webhook = new Webhook(this.config.topgg.webhook_auth)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/vote', webhook.listener(async (vote, req, res) => {
    if (!req || !res) return

    const user = await this.rest.users.get(vote.user).catch(() => null)

    if (!user) return

    const votes = await this.db.votes.getVotes(vote.user)

    await this.db.votes.addVote(vote.user, {
      bot: vote.bot ?? 'none',
      date: Date.now(),
      worth: vote.isWeekend ? 2 : 1,
      query: vote.query
    })

    if (this.config.topgg.vote_webhook) {
      await this.comms.sendWebhook(
        this.config.topgg.vote_webhook.id as any,
        this.config.topgg.vote_webhook.token,
        {
          embeds: [
            new Embed()
              .title('User Voted')
              .author(
                vote.type === 'test' ? 'Test DBL Vote Webhook' : 'DBL Vote Webhook',
                'https://cdn.discordapp.com/attachments/813578636162367559/813585465169018880/image0.png'
              )
              .color(
                vote.type === 'test'
                  ? this.config.topgg.webhook_color_test
                  : this.config.topgg.webhook_color
              )
              .description(`\`${user.username}#${user.discriminator}\` just voted!`)
              .footer(`They have voted ${votes.total_votes} time${votes.total_votes > 1 ? 's' : ''}!`)
              .render()
          ]
        }
      )
    }

    res.json({ success: true })
  }))
}
