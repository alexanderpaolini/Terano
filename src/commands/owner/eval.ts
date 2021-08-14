
import { CommandOptions } from 'discord-rose'

import util from 'util'

function clean (text: string): string {
  if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) } else { return text }
}

export default <CommandOptions>{
  name: 'Eval',
  command: 'eval',
  aliases: ['ev'],
  category: 'Owner',
  usage: '<code: String>',
  ownerOnly: true,
  exec: async (ctx) => {
    const worker = ctx.worker

    try {
      const code = ctx.args.join(' ')

      let evaled: string | string[]
      if (ctx.flags.m) evaled = await worker.comms.masterEval(code)
      else if (ctx.flags.b) evaled = await worker.comms.broadcastEval(code)
      // eslint-disable-next-line no-eval
      else evaled = await eval(code)

      if (typeof evaled !== 'string') { evaled = util.inspect(evaled) }

      if (ctx.flags.s || ctx.flags.silent) return

      await ctx.embed
        .color(ctx.worker.config.colors.GREEN)
        .title('Eval Successful')
        .description(`\`\`\`xl\n${evaled}\`\`\``)
        .send()
    } catch (err) {
      if (ctx.flags.s || ctx.flags.silent) return

      ctx.embed
        .color(ctx.worker.config.colors.RED)
        .title('Eval Unsuccessful')
        .description(`\`\`\`xl\n${clean(err)}\`\`\``)
        .send()
        .catch(() => { })
    }
  }
}
