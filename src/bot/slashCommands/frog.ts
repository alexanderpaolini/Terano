import { SlashCommand } from '../structures/SlashHandler'

import fetch from 'node-fetch'

export default {
  name: 'frog',
  description: 'Frog',
  options: [
    {
      name: 'frog',
      description: 'The type of frog',
      type: 3
    }
  ],
  exec: async (ctx) => {
    const frog = ctx.interaction.data?.options?.find(e => e.name === 'frog')
    if (frog && !('value' in frog)) return
    const frogType = frog?.value

    let url
    if (!frogType) {
      const res = await fetch('https://frogs.media/api/random')
      const json = await res.json()
      url = json.url
    } else url = `https://frogs.media/api/images/${frogType as string}`

    await ctx.send(url)
  }
} as SlashCommand
