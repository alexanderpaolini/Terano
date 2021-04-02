import { CommandOptions } from 'discord-rose'

const command: CommandOptions = {
  name: 'Sweep',
  usage: 'sweep',
  description: 'Sweep the database cache.',
  category: 'owner',
  command: 'sweep',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    const time = Date.now()

    ctx.worker.db.guildDB.guilds.clear()
    ctx.worker.db.userDB.levels.clear()
    ctx.worker.db.userDB.infos.clear()

    ctx.worker.log('Swept Database cache')

    await ctx.tinyResponse(ctx.worker.colors.ORANGE, `Swept Cache\nTook: ${Date.now() - time}ms`)
  }
}

export default command
