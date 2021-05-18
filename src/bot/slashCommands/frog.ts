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
  exec: async (worker, data) => {
    const frog = data.data.options?.find(e => e.name === 'frog')
    if (frog && !('value' in frog)) return
    const frogType = frog?.value

    let url
    if (!frogType) {
      const res = await fetch('https://frogs.media/api/random')
      const json = await res.json()
      url = json.url
    } else url = `https://frogs.media/api/images/${frogType as string}`

    await worker.api.request('POST', `/interactions/${data.id}/${data.token}/callback`, {
      body: { type: 4, data: { content: url } }
    })
  }
} as SlashCommand
