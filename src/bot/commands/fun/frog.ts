import { CommandOptions } from 'discord-rose/dist/typings/lib'

import fetch from 'node-fetch'

export default {
  name: 'frog',
  usage: 'frog',
  description: 'FROG. sourced from https://frogs.media',
  category: 'fun',
  command: 'frog',
  aliases: ['forg', 'froggers', 'og'],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    fetch('https://frogs.media/api/random')
      .then(async res => await res.json())
      .then(async json => {
        await ctx.reply(json.url)
      })
      .catch((err) => { throw new Error(err) })
  }
} as CommandOptions
