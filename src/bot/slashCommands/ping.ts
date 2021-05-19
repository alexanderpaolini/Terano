import { SlashCommand } from '../structures/SlashHandler'

import { performance } from 'perf_hooks'

import { getAvatar } from '../../utils'

export default {
  name: 'ping',
  description: 'Ping Pong!',
  exec: async (ctx) => {
    const time = performance.now()
    await ctx.thinking()

    await ctx.embed
      .author(`Pong! (${(performance.now() - time).toPrecision(5)}ms)`, getAvatar(ctx.user))
      .color(ctx.worker.colors.PURPLE)
      .send()
  }
} as SlashCommand
