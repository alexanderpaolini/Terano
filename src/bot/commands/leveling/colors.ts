import { CommandOptions } from 'discord-rose'

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
      if (!colorName) return ctx.error(await ctx.lang('CMD_COLOR_NONE'))

      // Get the color from the JSON
      const color = colors[colorName]
      if (!color) return ctx.error(await ctx.lang('CMD_COLOR_UNKNOWN', ctx.args.join(' ')))

      // Get the user settings
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Respond with success
      await ctx.normalResponse(Number('0x' + color.slice(1)), await ctx.lang('CMD_COLOR_UPDATED', color, colorName))
    } else {
      // If custom flag get the color as a string
      const color = String(ctx.flags.custom)

      // Update the string
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Return with success ezpz
      await ctx.normalResponse(Number('0x' + color.slice(1)), await ctx.lang('CMD_COLOR_UPDATEDCUSTOM', color))
    }
  }
} as CommandOptions
