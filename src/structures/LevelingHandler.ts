import TeranoWorker from './TeranoWorker'

import { Snowflake, APIMessage, APIUser } from 'discord-api-types'

import { Embed } from 'discord-rose'
import { getAvatar } from '../utils'

export class LevelingHandler {
  /**
   * Cooldown without duplicates
   */
  cooldown = new Set<string>()

  constructor (private readonly worker: TeranoWorker) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    worker.on('MESSAGE_CREATE', this.run.bind(this))
  }

  /**
   * The function that handles the leveling
   * @param data The message
   */
  async run (data: APIMessage): Promise<void> {
    if (!data.guild_id || data.author.bot) return

    const blacklist = await this.worker.db.userDB.getBlacklist(data.author.id)
    if (blacklist) return

    const str = `${data.guild_id}-${data.author.id}`
    if (this.cooldown.has(str)) return

    const userData = await this.worker.db.userDB.getLevel(data.author.id, data.guild_id)
    const guildData = await this.worker.db.guildDB.getGuild(data.guild_id)

    let xp = Number(userData.xp)
    xp += (Math.floor(Math.random() * 8) + 8) * guildData.level.xp_multplier

    const xpFromLevel = this.xpFromLevel(userData.level)
    if (xp > xpFromLevel) {
      userData.level++
      userData.xp = String(xp - xpFromLevel)

      await this.sendUpdateMessage(data.guild_id, data.author, data.channel_id, userData.level)
      await this.addLevelRole(data.guild_id, data.author, data.channel_id, userData.level)
    } else {
      userData.xp = String(xp)
    }

    await this.worker.db.userDB.updateLevel(userData)

    this.cooldown.add(str)
    setTimeout(() => { this.cooldown.delete(str) }, Number(guildData.level.cooldown) * 1000)
  }

  /**
   * Add the role corresponding to the level for the guild
   * @param guildID Guild ID
   * @param user The user
   * @param channelID Channel ID
   * @param level level
   */
  async addLevelRole (guildID: Snowflake, user: APIUser, channelID: Snowflake, level: number): Promise<void> {
    const guildData = await this.worker.db.guildDB.getGuild(guildID)
    const role = guildData.level.level_roles.find(e => e.level === level)
    if (!role) return

    await this.worker.api.members.addRole(guildID, user.id, role.id as Snowflake)
      .then(async () => {
        const msg = await this.worker.langs.getString(guildID, 'RANK_UP', level)

        const embed = new Embed()
          .color(this.worker.colors.GREEN)
          .author(msg, getAvatar(user))

        await this.worker.api.messages.send(channelID, embed)
      })
      .catch(async (err) => {
        const msg = await this.worker.langs.getString(guildID, 'ERROR', err)

        const embed = new Embed()
          .color(this.worker.colors.RED)
          .author(msg, getAvatar(user))

        await this.worker.api.messages.send(channelID, embed)
          .catch(() => { })
      })
  }

  /**
   * Send the Level-Up mesasge
   * @param guildID Guild ID
   * @param user The user
   * @param channelID Channel ID
   * @param level the level
   */
  async sendUpdateMessage (guildID: Snowflake, user: APIUser, channelID: Snowflake, level: number): Promise<void> {
    const guildData = await this.worker.db.guildDB.getGuild(guildID)
    if (!guildData.level.send_level_message) return

    const member = this.worker.members.get(guildID)?.get(user.id) ??
      await this.worker.api.members.get(guildID, user.id).catch(() => null)

    if (!member) return

    const guild = this.worker.guilds.get(guildID)

    if (!guild) return

    const msg = guildData.level.level_message.replace(/{{(.+?)}}/g, (match: string) => {
      switch (match.slice(2, -2)) {
        case 'tag': return `${user.username}#${user.discriminator}`

        case 'user':
        case 'username':
        case 'author': return user.username

        case 'nick':
        case 'nickname': return member.nick ?? user.username

        case 'guild':
        case 'server': return guild.name

        case 'lvl':
        case 'level': return String(level)

        default: return match
      }
    })

    const embed = new Embed()
      .color(this.worker.colors.PURPLE)
      .author(msg, getAvatar(user))

    await this.worker.api.messages.send(channelID, embed)
      .catch(() => {})
  }

  /**
   * Get the amount of xp required for the level
   * @param level The level
   */
  xpFromLevel (level: number): number {
    return Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))
  }
}
