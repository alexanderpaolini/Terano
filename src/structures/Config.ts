import { Snowflake } from 'discord-api-types'
import * as DotEnv from 'dotenv'

DotEnv.config()

const toCheckArr = [
  'MONGO_CONNECTION_STRING',
  'REDIS_CONNECTION_STRING',

  'DISCORD_TOKEN',
  'DISCORD_INVITE',

  'IMAGE_API_PORT',
  'IMAGE_API_KEY',

  'TOPGG_WEBHOOK_AUTH',
  'TOPGG_TOKEN',

  'API_PORT'
]
const missingProps: string[] = []

toCheckArr.forEach(e => {
  if (process.env[e] === undefined) missingProps.push(e)
})

if (missingProps.length) {
  const errMsg = `Missing env properties: ${missingProps.join(', ')}`
  throw new Error(errMsg)
}

function parseWebhook (name: string): { id: Snowflake, token: string } {
  const [id, token] = process.env[`DISCORD_WEBHOOK_${name.toUpperCase()}`]?.split(',') as [Snowflake, string]
  if (!id || !token) throw new Error(`Webhook ${name} doesn't exist`)
  return { id, token }
}

export const Config = {
  db: {
    connection_string: process.env.MONGO_CONNECTION_STRING as string
  },

  discord: {
    token: process.env.DISCORD_TOKEN as string,
    shards: process.env.DISCORD_SHARDS,

    webhooks: {
      errors: parseWebhook('error'),
      guilds: parseWebhook('guilds'),
      shards: parseWebhook('shards'),
      votes: parseWebhook('votes')
    },

    invite: process.env.DISCORD_INVITE as string,

    test_guild: process.env.TEST_GUILD,

    redis: process.env.REDIS_CONNECTION_STRING as string
  },

  api: {
    port: process.env.API_PORT
  },

  image_api: {
    port: process.env.IMAGE_API_PORT as unknown as number,
    token: process.env.IMAGE_API_KEY as string
  },

  topgg: {
    token: process.env.TOPGG_TOKEN as string,
    vote_webhook: parseWebhook('votes'),
    webhook_color_test: 0xFF0000,
    webhook_color: 0xb649eb,
    webhook_auth: process.env.TOPGG_WEBHOOK_AUTH as string
  },

  colors: {
    RED: 0xFF0000,
    SOFT_RED: 0xf04747,
    YELLOW: 0xfac10c,
    BLUE: 0x3782fb,
    ORANGE: 0xFFA500,
    GREEN: 0x2ECC71,
    PURPLE: 0xb649eb
  }
}
