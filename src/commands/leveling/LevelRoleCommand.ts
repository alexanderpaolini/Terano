import { Author, Command, Guild, MessageTypes, Options, SubCommand, UserPerms, Worker as GetWorker } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { APIGuild, APIUser, Snowflake } from 'discord-api-types'
import { Worker } from '../../structures/Bot'

@Command('levelrole', 'Manage the level-up rewards')
export class LevelRoleCommand {
  @SubCommand('add', 'Add a level-up reward role')
  @UserPerms('manageMessages')
  async addCommand (
    @GetWorker() worker: Worker,
    @Guild(true) guild: APIGuild,
    @Author() author: APIUser,
    @Options.Role('role', 'The role to be rewarded', { required: true }) roleId: Snowflake,
    @Options.Integer('level', 'The level when it will be given', { required: true }) level: number
  ): Promise<MessageTypes> {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles

    const exists = levelRoles.find(e => e.id === roleId && e.level === level)
    if (exists) {
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Level Role`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.RED)
        .description('That role is already rewarded at that level')
    }

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
    @Options.Integer('level', 'The level when is given', { required: true }) level: number
  ): Promise<MessageTypes> {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles

    const exists = levelRoles.find(e => e.id === roleId && e.level === level)
    if (!exists) {
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Level Role`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.RED)
        .description('That role is already rewarded at that level')
    }

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
    @Author() author: APIUser
  ): Promise<MessageTypes> {
    const guildData = await worker.db.guilds.getGuild(guild.id)
    const levelRoles = guildData.level.level_roles.sort((a, b) => a.level - b.level)

    if (!levelRoles.length) {
      return new Embed()
        .author(
          `${author.username}#${author.discriminator} | Level Role`,
          worker.utils.getAvatar(author)
        )
        .color(worker.config.colors.RED)
        .description('There are no level-up reward roles')
    }

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
