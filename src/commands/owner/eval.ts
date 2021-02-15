import { CommandOptions } from 'discord-rose/dist/typings/lib';

import { inspect } from 'util';

export default {
  name: 'Eval',
  usage: 'eval <code>',
  description: 'Eval some code on the worker process',
  category: 'owner',
  command: 'eval',
  aliases: ['ev'],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    let output: string;
    let status = true;

    const worker = ctx.worker;

    try {
      let toEval = ctx.args.join(' ').replace(/token/g, 'mem');
      let evaled = eval(toEval);

      if (evaled instanceof Promise) evaled = await evaled;
      evaled = typeof evaled !== 'string' ? inspect(evaled) : evaled;

      output = evaled.split(ctx.worker.options.token).join('[TOKEN REMOVED]');
    } catch (err) {
      status = false;
      output = err;
    }

    try {
      await ctx.worker.responses.tiny(ctx, status ? ctx.worker.colors.GREEN : ctx.worker.colors.RED, `js\n${output}`).then(e => {
        if (!e) throw new Error('Message Failed to Send');
      });
      return;
    } catch (err) {
      await ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `js\n${err.toString()}`);
      return;
    }
  }
} as CommandOptions;
