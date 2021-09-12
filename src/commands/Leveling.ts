import { Command, Options, Thinks, GetWorker, Run, Guild, UserPerms, Author, Member } from '@jadl/cmd'

import { Embed } from '@jadl/embed'

import { APIGuild, APIGuildMember, APIUser, Snowflake } from 'discord-api-types'

import { Worker } from '../structures/Bot'

@Command('color', 'Set your rank card accemt color')
export class ColorCommand {
  @Run()
  async exec (
    @Options.String('color', 'The accent color', true) color: string,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ) {
    await worker.db.users.setColor(author.id, color)

    console.log(this)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Color`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Rank card color set to \`${color}\``)
  }
}

@Command('cooldown', 'Set the XP cooldown')
export class CooldownCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.Integer('seconds', 'The delay in seconds', true) delay: number,
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser
  ) {
    await worker.db.guilds.setXPCooldown(guild.id, delay)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Cooldown`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`XP cooldown set to \`${delay}s\``)
  }
}

@Command('leaderboard', 'View the top ranks')
export class LeaderboardCommand {
  @Run()
  @Thinks()
  async exec (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild
  ) {
    const allLevels = (await worker.db.users.getAllLevels(guild.id))
      .sort((a, b) => {
        if (a.level !== b.level) return (b.level - a.level)
        else return (b.xp - a.xp)
      })

    const newDataArr = []

    for (const levelData of allLevels) {
      if (newDataArr.length === 8) continue

      const member = await worker.api.members.get(guild.id, levelData.user_id).catch(() => null)
      if (!member) continue

      const user = member.user!
      newDataArr.push({
        tag: `${user.username}#${user.discriminator}`,
        pfp: worker.utils.getGuildAvatar(member, guild.id),
        level: levelData.level,
        rank: Number(allLevels.indexOf(levelData)) + 1
      })

      const buffer = await worker.imageAPI.leaderboard(newDataArr)
      return { name: 'leaderboard.png', buffer }
    }
  }
}

// TODO: Levelrole

@Command('multiplier', 'Change the XP multiplier')
export class MultiplierCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.Integer('multiplier', 'The XP multiplier', true) multiplier: number,
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser
  ) {
    if (multiplier <= 0 || multiplier > 100)
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Multiplier`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.RED)
        .description(`The XP multiplier must be greater than 0 and less than 100`)

    await worker.db.guilds.setXPMultiplier(guild.id, multiplier)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Multiplier`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`XP multiplier set to \`${multiplier}x\``)
  }
}

@Command('rank', 'View your or another person\'s rank')
export class RankCommand {
  @Run()
  @Thinks()
  async exec (
    @Options.User('user', 'The user') u: Snowflake | undefined,
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser,
    @Member() member: APIGuildMember
  ) {
    const userId = u ?? author.id
    member = await worker.api.members.get(guild.id, userId).catch(() => null) ?? member

    const user = member.user!

    const userOptions = await worker.db.users.getSettings(user.id)
    const userData = await worker.db.users.getLevel(user.id, guild.id)

    const buffer = await worker.imageAPI.card({
      color: userOptions.level.color || await worker.db.guilds.getDefaultLevelColor(guild.id),
      level: userData.level,
      maxxp: Math.floor(100 + 5 / 6 * userData.level * (2 * userData.level * userData.level + 27 * userData.level + 91)),
      picture: userOptions.level.picture || worker.utils.getGuildAvatar(member, guild.id, 'png', 256),
      tag: userOptions.level.tag,
      usertag: `${user.username}#${user.discriminator}`,
      xp: userData.xp
    })

    return { name: 'rank.png', buffer }
  }
}

@Command('setlevelmessage', 'Set the level-up message')
export class SetLevelMessageCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.String('message', 'The level-up message', true) message: string,
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ) {
    await worker.db.guilds.setLevelMessage(guild.id, message)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Set Level-Up Message`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Level-up message set to \`${message}\``)
  }
}

@Command('tag', 'The display tag')
export class TagCommand {
  @Run()
  async exec (
    @Options.String('tag', 'The display tag', true) tag: string,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ) {
    if (tag.length > 30)
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Tag`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.GREEN)
        .description('Tag must be no longer than thirty (30) characters')

    await worker.db.users.setTag(author.id, tag)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Tag`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Rank card tag set to \`${tag}\``)
  }
}

@Command('togglelevelmessage', 'Toggle the level-up message')
export class ToggleLevelMessageCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Guild(true) guild: APIGuild,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ) {
    const sendMesasge = !(await worker.db.guilds.getSendLevelMessage(guild.id))
    await worker.db.guilds.setSendLevelMessage(guild.id, sendMesasge)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Tag`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description(`Level-Up messages \`${sendMesasge ? 'enabled' : 'disabled'}\``)
  }
}
