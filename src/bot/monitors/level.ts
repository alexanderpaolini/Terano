import { APIGuild, Snowflake, APIMessage } from 'discord-api-types'
import { getAvatar } from '../../utils'
import Monitor from '../structures/Monitor'

export default class PrefixMonitor extends Monitor {
  cooldown = new Set()

  async run (message: APIMessage): Promise<void> {
    if (!message.guild_id) return
    const guildDoc = await this.worker.db.guildDB.getGuild(message.guild_id)
    const userDoc = await this.worker.db.userDB.getLevel(message.author.id, message.guild_id)

    let xp = Number(userDoc.xp)
    xp += (Math.floor(Math.random() * 8) + 8) * guildDoc.level.xp_multplier

    if (xp > this.xpFromLevel(userDoc.level)) {
      userDoc.level++
      userDoc.xp = String(xp - Number(userDoc.xp))

      if (guildDoc.level.send_level_message) await this.sendUpdateMessage(message, userDoc.level, guildDoc)
      const role = guildDoc.level.level_roles.find(r => r.level === userDoc.level)

      if (role != null) await this.addUserRole(message, role)
    } else userDoc.xp = String(xp)

    await this.worker.db.userDB.updateLevel(userDoc)

    this.cooldown.add(`${message.guild_id as string}${message.author.id as string}`)
    setTimeout(() => { this.cooldown.delete(`${message.guild_id as string}${message.author.id as string}`) }, Number(guildDoc.level.cooldown) * 1000)
  }

  async restrictions (msg: APIMessage): Promise<boolean> {
    if (!(msg?.author?.id as string) || msg.author.bot as boolean || !(msg.guild_id as string) || this.cooldown.has(`${msg.guild_id as string}${msg.author.id as string}`)) return false
    if (await this.worker.db.userDB.getBlacklist(msg.author.id)) return false
    return true
  }

  async sendUpdateMessage (message: APIMessage, level: number, guildDoc: GuildDoc): Promise<void> {
    if (!message.guild_id) return
    const guild = this.worker.guilds.get(message.guild_id) as APIGuild

    const member = await this.worker.api.members.get(message.guild_id, message.author.id)

    const msg = guildDoc.level.level_message.replace(/{{(.+?)}}/g, (match: any | string | number) => {
      switch (match.slice(2, -2)) {
        case 'tag': return `${message.author.username}#${message.author.discriminator}`

        case 'user':
        case 'username': return message.author.username

        case 'nick':
        case 'nickname': return member.nick ?? message.author.username

        case 'server':
        case 'guild': return guild.name

        case 'lvl':
        case 'level': return level

        default: return match
      }
    })

    const embed = {
      color: this.worker.colors.GREEN,
      author: {
        name: msg,
        icon_url: getAvatar(message.author)
      }
    }

    await this.worker.api.messages.send(message.channel_id, { embed: embed }).catch(err => this.worker.log(err.toString()))
  }

  xpFromLevel (level: number): number {
    return Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))
  }

  async addUserRole (message: any, role: LevelRole): Promise<void> {
    await this.worker.api.members.addRole(message.guild_id, message.author.id, role.id as Snowflake)
      .then(async () => {
        void await this.worker.api.messages.send(message.channel_id as Snowflake, {
          embed: {
            color: this.worker.colors.GREEN,
            author: {
              name: await this.worker.langs.getString(message.guild_id, 'RANK_UP'),
              icon_url: getAvatar(message.author)
            }
          }
        })
          .catch(async err => { this.worker.log(err) })
      })
      .catch(async err => {
        void await this.worker.api.messages.send(message.channel_id as Snowflake, {
          embed: {
            color: this.worker.colors.GREEN,
            author: {
              name: await this.worker.langs.getString(message.guild_id, 'ERROR', err),
              icon_url: getAvatar(message.author)
            }
          }
        })
          .catch(async err_ => { this.worker.log(err_) })
      })
  }
}
