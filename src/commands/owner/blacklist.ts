import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Blacklist',
  command: 'blacklist',
  aliases: ['bl'],
  category: 'Owner',
  usage: '<user: String>',
  ownerOnly: true,
  exec: async (ctx) => {
    const userId: string = ctx.args[0]

    const isUserOwner = await ctx.worker.db.users.getOwner(userId)
    if (isUserOwner) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: 'You can\'t do that'
      })
      return
    }

    const blacklisted = !(await ctx.worker.db.users.getBlacklist(userId))
    await ctx.worker.db.users.setBlacklist(userId, blacklisted)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `<@${userId}> ${!blacklisted ? 'un' : ''}blacklisted`
    })
  }
}
