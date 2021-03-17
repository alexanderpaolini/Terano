import { CommandOptions } from 'discord-rose/dist/typings/lib'

import colors from '../../../utils/colors'

export default {
  name: 'Color',
  usage: 'color <color>',
  description: 'Change the color of your rank card.',
  category: 'leveling',
  command: 'color',
  aliases: ['colour'],
  exec: async (ctx) => {
    if (!ctx.flags.custom) {
      // Get the name of the color
      const colorName = ctx.args.join('').toLowerCase()
      if (!colorName) return await ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No color was given.')

      // Get the color from the JSON
      const color = colors[colorName]
      if (!color) return await ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `I don't know the color \`${ctx.args.join(' ')}\`.`)

      // Get the user settings
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Respond with success
      await ctx.worker.responses.normal(ctx, Number('0x' + color.slice(1)), `Set card color to **${color}** (${colorName})`)
    } else {
      // If custom flag get the color as a string
      const color = String(ctx.flags.custom)

      // Update the string
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Return with success ezpz
      await ctx.worker.responses.normal(ctx, Number('0x' + color.slice(1)), `Set card color to **${color}**`)
      ctx.invokeCooldown()
    }
  }
} as CommandOptions
