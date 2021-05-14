import { CommandOptions } from 'discord-rose'

import fetch from 'node-fetch'

export default {
  command: 'frog',
  category: 'fun',
  aliases: ['forg', 'froggers', 'og'],
  locale: 'FROG',
  exec: async (ctx) => {
    const json = await fetch('https://frogs.media/api/random')
      .then(async e => await e.json())
      .catch(() => null)

    if (!json || !json.url) {
      await ctx.respond('SERVER_ERROR', { error: true })
      return
    }

    await ctx.reply(json.url)
  }
} as CommandOptions
