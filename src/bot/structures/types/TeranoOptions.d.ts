import { ConnectOptions } from 'mongoose'
import { ClientOpts } from 'redis'

interface TeranoOptions {
  prod: boolean
  mongodb: {
    connectURI: string
    connectOptions: ConnectOptions
  }
  redis: ClientOpts
  discord: {
    token: string
  }
  topgg: {
    token: string
    webhook: {
      auth: string
    }
  }
  api: {
    port: number
  }
  webhooks: {
    [key: string]: Webhook
  }
}

interface Webhook {
  id: string
  token: string
}
