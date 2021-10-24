import { APIGuild, APIGuildMember, APIUser, MessageFlags, Snowflake } from 'discord-api-types'

import { Command, Options, Thinks, Worker as GetWorker, Run, Guild, UserPerms, Author, Member, FileBuilder, SubCommand } from '@jadl/cmd'
import { Embed } from '@jadl/embed'

import { Worker } from '../structures/Bot'

@Command('color', 'Set your rank card accent color')
export class ColorCommand {
  @Run()
  async exec (
    @Options.String('color', 'The accent color', { required: true }) color: string,
    @GetWorker() worker: Worker,
    @Author() author: APIUser
  ) {
    await worker.db.users.setColor(author.id, color)

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
    @Options.Integer('seconds', 'The delay in seconds', { required: true }) delay: number,
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
    @Guild(true) guild: APIGuild,
    @Options.Boolean('ephemeral', 'Whether or not to send as ephemeral') ephemeral: boolean
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
      return new FileBuilder()
        .add('leaderboard.png', buffer)
        .extra({
          flags: ephemeral ? MessageFlags.Ephemeral : undefined
        })
    }
  }
}

@Command('levelrole', 'Manage the level-up rewards')
export class LevelRoleCommand {
  @SubCommand('add', 'Add a level-up reward role')
  @UserPerms('manageMessages')
  async addCommand (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser,
    @Options.Role('role', 'The role to be rewarded', { required: true }) roleId: Snowflake,
    @Options.Integer('level', 'The level when it will be given', { required: true }) level: number,
  ) {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles

    const exists = levelRoles.find(e => e.id === roleId && e.level === level)
    if (exists) return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Level Role`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.RED)
      .description('That role is already rewarded at that level')

    await worker.db.guilds.addLevelRole(guild.id, roleId, level)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Level Role`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description('Added role to level-up rewards')
  }

  @SubCommand('remove', 'Remove a level-up reward role')
  @UserPerms('manageMessages')
  async removeCommand (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser,
    @Options.Role('role', 'The role that is rewarded', { required: true }) roleId: Snowflake,
    @Options.Integer('level', 'The level when is given', { required: true }) level: number,
  ) {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles

    const exists = levelRoles.find(e => e.id === roleId && e.level === level)
    if (!exists) return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Level Role`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.RED)
      .description('That role is already rewarded at that level')

    guildData.level.level_roles = levelRoles.filter(
      e => !(e.id === roleId && e.level === level)
    )
    await worker.db.guilds.updateGuild(guildData)

    return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Level Role`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.GREEN)
      .description('Removed role from level-up rewards')
  }

  @SubCommand('list', 'List the level-up reward roles')
  async listCommand (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser,
  ) {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles.sort((a, b) => a.level - b.level)

    if (!levelRoles.length) return new Embed()
      .author(
        `${author.username}#${author.discriminator} | Level Role`,
        worker.utils.getAvatar(author)
      )
      .color(worker.config.colors.RED)
      .description('There are no level-up reward roles')

    return new Embed()
      .author(
        'Level-Up Role Rewards',
        worker.utils.getGuildAvatar(worker.selfMember.get(guild.id)!, guild.id)
      )
      .description(
        levelRoles.map(e => `\`${e.level}\`: <@&${e.id}>`).join('\n') || 'None'
      )
      .color(worker.config.colors.PURPLE)
  }
}

@Command('multiplier', 'Change the XP multiplier')
export class MultiplierCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.Integer('multiplier', 'The XP multiplier', { required: true }) multiplier: number,
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
    @Member() member: APIGuildMember,
    @Options.Boolean('ephemeral', 'Whether or not to send as ephemeral') ephemeral: boolean
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

    return new FileBuilder()
      .add('rank.png', buffer)
      .extra({
        flags: ephemeral ? MessageFlags.Ephemeral : undefined
      })
  }
}

@Command('setlevelmessage', 'Set the level-up message')
export class SetLevelMessageCommand {
  @Run()
  @UserPerms('manageMessages')
  async exec (
    @Options.String('message', 'The level-up message', { required: true }) message: string,
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
    @Options.String('tag', 'The display tag', { required: true }) tag: string,
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
