import { APIGuildMember, APIUser, Snowflake } from 'discord-api-types'

import colors from 'colors/safe'
import { Cluster } from 'discord-rose'

/**
 * Function to escape code [stolen from here](https://stackoverflow.com/questions/39542872/escaping-discord-subset-of-markdown)
 * @param text String to be escaped
 */
export function escapeMarkdown (text: string): string {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
  return escaped
}

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 */
export function getAvatar (user: APIUser, type: string = 'png', size: number = 128): string {
  if (user.avatar !== null) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=${size}`
  return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`
}

export function getGuildAvatar (user: APIGuildMember, guildId: Snowflake, type: string = 'png', size: number = 128): string {
  // @ts-expect-error
  if (user.avatar) return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.user.id}/avatars/${user.avatar as string}.${type}?size=${size}`
  else return getAvatar(user.user as unknown as APIUser)
}

/**
 * Format the time broski
 * @param time how long in milliseconds
 */
export function formatTime (time: number): string {
  let hours = 0
  let minutes = 0
  let seconds = 0

  // Hours
  while (time > 3600000) {
    hours++
    time = time - 3600000
  }

  // Minutes
  while (time > 60000) {
    minutes++
    time = time - 60000
  }

  // Seconds
  while (time > 1000) {
    seconds++
    time = time - 1000
  }

  const h = `${hours === 0 ? '' : `${hours} hour${hours > 1 ? 's' : ''}${minutes === 0 ? ' and' : ','} `}`
  const m = `${minutes === 0 ? '' : `${minutes} minute${minutes > 1 ? 's' : ''}${hours === 0 ? ' and' : ', and'} `}`
  const s = `${seconds > 1 ? seconds : 1} second${seconds > 1 ? 's' : ''}`

  return h + m + s
}

/**
 * Make a string longer
 * @param str String
 * @param to string length
 */
export function separate (str: string, to: number): string {
  let res = str
  let sw = 1
  for (let i = 0; i < 100; i++) {
    if (sw === 1) res = res + ' '
    else res = ' ' + res
    if (res.length >= to) break
    sw = sw * -1
  }
  return res
}

/**
 * Get a formatted date
 * @param time A date
 */
export function getTime (time: Date): string {
  const hours = time.getHours().toString().padStart(2, '0') + 'h'
  const minutes = time.getMinutes().toString().padStart(2, '0') + 'm'
  const seconds = time.getSeconds().toString().padStart(2, '0') + 's'
  return `${hours}:${minutes}:${seconds}`
}

/**
 * Log function for master
 * @param cluster Cluster
 * @param length How long the longest name is
 * @param msg what to actually log
 */
export function log (cluster: Cluster | undefined, length: number, msg: string): void {
  const separator = '|'
  const date = getTime(new Date())
  const c = cluster
    ? `Cluster ${cluster.id}${' '.repeat(length - cluster.id.length)}`
    : `Master ${' '.repeat(length + 1)}`

  console.log(colors.yellow(date), separator, colors.red(c.toUpperCase()), separator, msg)
}
