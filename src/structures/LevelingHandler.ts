import { APIGuildMember, APIMessage, Snowflake } from 'discord-api-types'
import { Embed } from 'discord-rose'
import { Worker } from './Bot/Worker'

export class LevelingHandler {
  cooldowns = new Set<string>()

  constructor (private readonly worker: Worker) {
    this.worker.on('MESSAGE_CREATE', this.run.bind(this))
  }

  async run (msg: APIMessage): Promise<void> {
    if (!msg.guild_id || !!msg.author.bot || !msg.member) return

    const prefix = await this.worker.db.guilds.getPrefix(msg.guild_id)
    if (msg.content.startsWith(prefix)) return

    msg.member.user = msg.author

    const blacklist = await this.worker.db.users.getBlacklist(msg.author.id)
    if (blacklist) return

    const cooldownStr = `${msg.guild_id}-${msg.author.id}`
    if (this.cooldowns.has(cooldownStr)) return

    const userData = await this.worker.db.users.getLevel(msg.author.id, msg.guild_id)
    const guildData = await this.worker.db.guilds.getGuild(msg.guild_id)

    const xp = userData.xp + ((Math.floor(Math.random() * 8) + 8) * guildData.level.xp_multplier)

    const xpFromLevel = this.xpFromLevel(userData.level)

    userData.xp = xp
    if (xp > xpFromLevel) {
      userData.level = userData.level + 1
      userData.xp = xp - xpFromLevel

      const rolesAdded = await this.addLevelRole(msg.guild_id, msg.member, userData.level)
      await this.sendLevelMessage(msg.guild_id, msg.channel_id, msg.member, userData.level, rolesAdded)
    }

    await this.worker.db.users.updateLevel(userData)

    this.cooldowns.add(cooldownStr)
    setTimeout(() => { this.cooldowns.delete(cooldownStr) }, guildData.level.cooldown * 1000)
  }

  async addLevelRole (guildId: Snowflake, member: APIGuildMember, level: number): Promise<string[]> {
    const guildData = await this.worker.db.guilds.getGuild(guildId)

    const roles = guildData.level.level_roles.filter(l => l.level === level)

    if (roles.length === 0) return []

    const rolesAdded: string[] = []
    for (const role of roles) {
      try {
        await this.worker.api.members.addRole(guildId, member.user!.id, role.id)
        rolesAdded.push(role.id)
      } catch (e) { }
    }

    if (rolesAdded.length === 0) return []

    return rolesAdded
  }

  async sendLevelMessage (guildId: Snowflake, channelId: Snowflake, member: APIGuildMember, level: number, rolesAdded?: string[]): Promise<void> {
    const embed = new Embed()
      .color(this.worker.config.colors.PURPLE)

    const sendMessages = await this.worker.db.guilds.getSendLevelMessage(guildId)
    if (!sendMessages && !rolesAdded) return

    const avatarUrl = this.worker.utils.getGuildAvatar(member, guildId)

    if (rolesAdded && rolesAdded.length > 0) {
      embed
        .author(`You ranked up to level ${level}!`, avatarUrl)
        .description(`Role${rolesAdded.length === 1 ? '' : 's'} given: ${rolesAdded.map(e => `<@&${e}>`).join(', ')}`)
    } else {
      embed
        .author(
          await this.generateLevelMessage(guildId, member, level),
          avatarUrl
        )
    }

    await this.worker.api.messages.send(channelId, embed).catch(() => null)
  }

  async generateLevelMessage (guildId: Snowflake, member: APIGuildMember, level: number): Promise<string> {
    const guild = this.worker.guilds.get(guildId)!
    const guildData = await this.worker.db.guilds.getGuild(guildId)

    return guildData.level.level_message.replace(/{{(.+?)}}/g, (match: string) => {
      switch (match.slice(2, -2)) {
        case 'user':
        case 'username':
        case 'author': return member.user!.username
        case 'nick':
        case 'nickname': return member.nick ?? member.user!.username
        case 'tag': return `${member.user!.username}#${member.user!.discriminator}`
        case 'guild':
        case 'server': return guild.name
        case 'lvl':
        case 'level': return String(level)
        default: return match
      }
    })
  }

  xpFromLevel (level: number): number {
    return Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))
  }
}
