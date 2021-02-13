import CommandOptions from '../../structures/CommandOptions';

import { inspect } from 'util';

export default {
  name: 'Eval',
  command: 'eval',
  aliases: ['ev'],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    let output: string;
    let status = true;
    try {
      let evaled = eval(ctx.args.join(' '));

      if (evaled instanceof Promise) evaled = await evaled;
      evaled = inspect(evaled);

      output = evaled.split(ctx.worker.options.token).join('[TOKEN REMOVED]');
    } catch (err) {
      status = false;
      output = err;
    }
    try {
      ctx.worker.responses.tiny(ctx, status ? ctx.worker.colors.GREEN : ctx.worker.colors.RED, `js\n${output}`);
      return;
    } catch (err) {
      ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `js\n${err.toString()}`);
      return;
    }
  }
} as CommandOptions;
