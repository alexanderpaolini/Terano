import { APIUser, APIGuildMember, Snowflake } from 'discord-api-types'

// I don't really care to be honest
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Utils {
  static get mem (): NodeJS.MemoryUsage {
    return Object.entries(process.memoryUsage()).reduce<any>(function reduce (T, [K, V]) { T[K] = (V / (1024 ** 2)).toFixed(1) + 'MB'; return T }, {})
  }

  /**
   * Function to escape code [stolen from here](https://stackoverflow.com/questions/39542872/escaping-discord-subset-of-markdown)
   * @param text String to be escaped
   */
  static escapeMarkdown (text: string): string {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }

  static getAvatar (user: APIUser, type: string = 'png', size: number = 128): string {
    if (user.avatar !== null) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type ?? (user.avatar.startsWith('a_') ? 'gif' : 'png')}?size=${size}`
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`
  }

  static getGuildAvatar (user: APIGuildMember, guildId: Snowflake, type?: string, size?: number): string {
    // @ts-expect-error I don't really care
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (user.avatar) return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.user?.id}/avatars/${user.avatar as string}.${type ?? (user.avatar.startsWith('a_') ? 'gif' : 'png')}?size=${size ?? 128}`
    else return this.getAvatar(user.user as unknown as APIUser)
  }
}
