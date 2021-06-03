import { config } from 'dotenv'

import { OAuth2Scopes, Snowflake } from 'discord-api-types'

config()

function parseWebhook (name: string): { id: Snowflake, token: string } {
  const [id, token] = process.env[`DISCORD_WEBHOOK_${name.toUpperCase()}`]?.split(',') as [Snowflake, string]
  return { id, token }
}

export const Config = {
  oauth: {
    id: process.env.OAUTH_ID as string,
    scopes: [OAuth2Scopes.Identify, OAuth2Scopes.Guilds],
    client_secret: process.env.OAUTH_CLIENT_SECRET as string
  },

  db: {
    connection_string: process.env.DATABASE_CONNECTION_STRING as string
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

    test_guild: '564790211561652237'
  },

  influx: {
    host: process.env.INFLUXDB_HOST as string,
    database: process.env.INFLUXDB_DATABASE as string
  },

  topgg: {
    token: process.env.TOPGG_TOKEN as string,
    webhook_auth: process.env.TOPGG_WEBHOOK_AUTH as string
  },

  api: {
    port: process.env.NODE_ENV === 'production' ? 3002 : 3004
  },

  image_api: {
    port: process.env.NODE_ENV === 'production' ? 6962 : 6969
  },

  redis: {
    host: '127.0.0.1',
    port: 6379
  },

  prod: process.env.NODE_ENV === 'production'
}
