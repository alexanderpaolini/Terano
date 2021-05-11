import { CommandOptions } from 'discord-rose'

import fetch from 'node-fetch'

export default {
  command: 'frog',
  category: 'fun',
  aliases: ['forg', 'froggers', 'og'],
  locale: 'FROG',
  exec: async (ctx) => {
    fetch('https://frogs.media/api/random')
      .then(async res => await res.json())
      .then(async json => {
        await ctx.reply(json.url)
      })
      .catch(ctx.error)
  }
} as CommandOptions
