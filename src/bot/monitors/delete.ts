import Monitor from '../lib/Monitor'

import { APIMessage } from 'discord-api-types'

export default class PrefixMonitor extends Monitor {
  async run (msg: APIMessage): Promise<void> {
    this.worker.api.messages.delete(msg.channel_id, msg.id)
      .then(() => { console.log('deleted github message') })
      .catch(console.log)
  }

  async restrictions (msg: APIMessage): Promise<boolean> {
    return msg.channel_id === '810952830101356544' && !!msg.embeds?.[0]?.description?.match(/(docs|build): (tsc|api docs) build/)
  }
}
