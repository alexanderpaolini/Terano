import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Disable',
  command: 'disable',
  category: 'Owner',
  usage: '<command: String>',
  ownerOnly: true,
  exec: async (ctx) => {
    const cmd: string = ctx.args.shift()
    const command = ctx.worker.commands.find(cmd)

    if (!command) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: `Command "${cmd}" doesn't exist :(`
      })
      return
    }

    command.disabled = !command.disabled
    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `Command \`${command.name}\` ${command.disabled ? 'disabled' : 'enabled'}`
    })
  }
}
