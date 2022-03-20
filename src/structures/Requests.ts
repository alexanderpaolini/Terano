import { RequestData, REST } from '@discordjs/rest'
import { formatMessage, MessageTypes } from '@jadl/cmd'
import types, { Routes, Snowflake } from 'discord-api-types/v9'

export class Requests {
  constructor (private readonly api: REST) { }

  async sendMessage (
    channelId: Snowflake,
    message: MessageTypes,
    extra?: RequestData
  ): Promise<types.RESTPostAPIChannelMessageResult> {
    return await this.api.post(Routes.channelMessages(channelId) as unknown as `/${string}`, {
      body: formatMessage(message).data,
      ...extra
    }) as any
  }

  async sendWebhookMessage (
    webhookId: Snowflake,
    webhookToken: string,
    message: types.RESTPostAPIWebhookWithTokenJSONBody
  ): Promise<types.RESTPostAPIWebhookWithTokenWaitResult> {
    return await this.api.post(Routes.webhook(webhookId, webhookToken) as unknown as `/${string}`, {
      query: new URLSearchParams({ wait: 'true' }),
      body: message
    }) as any
  }

  async addRole (
    guildId: Snowflake,
    userId: Snowflake,
    roleId: Snowflake,
    extra?: RequestData
  ): Promise<types.RESTPutAPIGuildMemberRoleResult> {
    return await this.api.put(
      Routes.guildMemberRole(guildId, userId, roleId) as unknown as `/${string}`,
      extra
    ) as never
  }

  async getMember (
    guildId: Snowflake,
    userId: Snowflake,
    extra?: RequestData
  ): Promise<types.RESTGetAPIGuildMemberResult> {
    return await this.api.get(Routes.guildMember(guildId, userId) as unknown as `/${string}`, extra) as any
  }
}
