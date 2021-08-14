import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Owner',
  command: 'owner',
  aliases: ['bl'],
  category: 'Owner',
  usage: '<user: String>',
  ownerOnly: true,
  exec: async (ctx) => {
    const userId: string = ctx.args[0]

    if (userId === ctx.author.id) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: 'You can\'t do that'
      })
      return
    }

    const owner = !(await ctx.worker.db.users.getOwner(userId))
    await ctx.worker.db.users.setOwner(userId, owner)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `<@${userId}> is ${owner ? 'now' : 'no longer'} an owner`
    })
  }
}
