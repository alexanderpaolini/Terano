import { SlashCommand } from '../structures/SlashHandler'

import { APIApplicationCommandGuildInteraction } from 'discord-api-types'

import { Embed } from 'discord-rose'
import { performance } from 'perf_hooks'

import { getAvatar } from '../../utils'

export default {
  name: 'ping',
  description: 'Ping Pong!',
  exec: async (worker, data: APIApplicationCommandGuildInteraction) => {
    if (data.type !== 2) return

    const user = data.member.user

    const time = performance.now()
    await worker.api.request('POST', `/interactions/${data.id}/${data.token}/callback`, {
      body: { type: 5 }
    })

    const embed = new Embed()
      .author(`Pong! (${(performance.now() - time).toPrecision(5)}ms)`, getAvatar(user))
      .color(worker.colors.PURPLE)

    await worker.api.request('PATCH', `/webhooks/692029320775860245/${data.token}/messages/@original`, {
      body: { embeds: [embed.render()] }
    })
  }
} as SlashCommand
