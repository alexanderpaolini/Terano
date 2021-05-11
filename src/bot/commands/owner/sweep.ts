import { CommandOptions } from 'discord-rose'

import { performance } from 'perf_hooks'

const command: CommandOptions = {
  name: 'Sweep',
  usage: 'sweep',
  description: 'Sweep the database cache.',
  category: 'owner',
  command: 'sweep',
  aliases: [],
  userPerms: [],
  owner: true,
  exec: async (ctx) => {
    const time = performance.now()

    ctx.worker.db.guildDB.guilds.clear()

    ctx.worker.db.Oauth2DB.cache.clear()

    ctx.worker.db.userDB.levels.clear()
    ctx.worker.db.userDB.infos.clear()
    ctx.worker.db.userDB.settings.clear()

    ctx.worker.log('Swept Database cache')

    await ctx.tinyResponse(ctx.worker.colors.ORANGE, `Swept Cache\nTook: ${(performance.now() - time).toFixed(3)}ms`)
  }
}

export default command
