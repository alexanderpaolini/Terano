import { CommandOptions } from 'discord-rose'

import { performance } from 'perf_hooks'

export default {
  command: 'sweep',
  category: 'owner',
  locale: 'SWEEP',
  owner: true,
  exec: async (ctx) => {
    const time = performance.now()

    ctx.worker.db.guildDB.guilds.clear()
    ctx.worker.db.Oauth2DB.cache.clear()
    ctx.worker.db.userDB.levels.clear()
    ctx.worker.db.userDB.infos.clear()
    ctx.worker.db.userDB.settings.clear()

    ctx.worker.log('Swept Database cache')

    await ctx.respond('CMD_SWEEP', { color: ctx.worker.colors.ORANGE }, (performance.now() - time).toFixed(3))
    return true
  }
} as CommandOptions<boolean>
