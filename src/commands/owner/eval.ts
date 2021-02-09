import CommandContext from '../../structures/CommandContext';
import { inspect } from 'util';

export default {
  command: 'eval',
  userPerms: [''],
  botPerms: ['owner'],
  exec: async (ctx: CommandContext) => {
    const userDoc = await ctx.worker.dbModels.userModel.findOne({ id: ctx.message.author.id })
    if (!userDoc || !userDoc.owner) return await ctx.embed
      .title('Owner Only Command')
      .description(`\`\`\`You can't run this command, silly.\`\`\``)
      .color(ctx.worker.colors.RED)
      .send()
    let output: string;
    let status = true;
    try {
      let evaled = eval(ctx.message.content.slice(6));

      if (evaled instanceof Promise) evaled = await evaled;
      evaled = inspect(evaled);

      output = evaled.split(ctx.worker.options.token).join('[TOKEN REMOVED]');
    } catch (err) {
      status = false
      output = err;
    }
    try {
      await ctx.embed
        .description(`\`\`\`js\n${output}\`\`\``)
        .color(status ? ctx.worker.colors.GREEN : ctx.worker.colors.RED)
        .send()
      return;
    } catch (err) {
      await ctx.embed
        .description(`\`\`\`js\n${err.toString()}\`\`\``)
        .color(ctx.worker.colors.RED)
        .send()
    }
  }
};
