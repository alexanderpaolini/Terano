import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Throw',
  command: 'throw',
  category: 'Owner',
  usage: '<message: String>',
  ownerOnly: true,
  exec: async (ctx) => {
    const err = ctx.args.join(' ') || 'ERROR'

    if (ctx.flags.respond || ctx.flags.r) {
      await ctx.respond({
        text: `\`\`\`Error: ${err}\`\`\``,
        color: ctx.worker.config.colors.RED
      })
      return
    }

    if (ctx.flags.safe || ctx.flags.s) {
      await ctx.error(err)
      return
    }

    throw new Error(err)
  }
}
