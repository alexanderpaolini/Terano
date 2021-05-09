import { CommandOptions } from 'discord-rose'

import fetch from 'node-fetch'

export default {
  name: 'frog',
  usage: 'frog',
  description: 'FROG. sourced from https://frogs.media',
  category: 'fun',
  command: 'frog',
  aliases: ['forg', 'froggers', 'og'],
  userPerms: [],
  myPerms: [],
  owner: false,
  exec: async (ctx) => {
    fetch('https://frogs.media/api/random')
      .then(async res => await res.json())
      .then(async json => {
        await ctx.reply(json.url)
      })
      .catch(ctx.error)
  }
} as CommandOptions
