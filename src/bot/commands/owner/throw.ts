import { CommandOptions } from 'discord-rose'

export default {
  name: 'throw',
  usage: 'throw',
  description: 'throw',
  category: 'owner',
  command: 'throw',
  aliases: [],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    if (ctx.flags.safe) return await ctx.error(ctx.args.join(' '))
    throw new Error(ctx.args.join(' '))
  }
} as CommandOptions
