import { CommandContext } from "discord-rose/dist/typings/lib";

import Collection from '@discordjs/collection';

interface CooldownObject {
  time: number;
  timeout: number;
  createdMessage?: boolean;
}

function formatTime(time: number) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Hours
  while (time > 3600000) {
    hours++;
    time = time - 3600000;
  }

  // Minutes
  while (time > 60000) {
    minutes++;
    time = time - 60000;
  }

  // Seconds
  while (time > 1000) {
    seconds++;
    time = time - 1000;
  }

  return `${hours ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}${hours ? ', and' : ' and'} ` : ''}${seconds > 1 ? seconds : 1} second${seconds > 1 ? 's' : ''}`;
}

export default () => {
  const cooldowns: Collection<string, CooldownObject> = new Collection();
  const guildProtecton: string[] = [];

  return (ctx: CommandContext) => {

    if (guildProtecton.filter(e => e === ctx.guild.id).length > 40) {
      ctx.worker.webhooks.shard(ctx.worker.colors.RED, `Guild ${ctx.guild.id} excedeed ratelimit`)
      return false;
    }

    guildProtecton.push(ctx.guild.id);
    setTimeout(() => {
      guildProtecton.splice(guildProtecton.indexOf(ctx.guild.id), 1);
    }, 5000);

    if (!ctx.command.cooldown) {
      ctx.invokeCooldown = () => {
        throw new Error(`cooldown does not exist on command ${ctx.command.command}`);
      };
      return true;
    }

    const id = `${ctx.message.author.id}-${ctx.guild.id}-${ctx.command.command}`;
    const currentCooldown = cooldowns.get(id);

    if (currentCooldown) {
      if (currentCooldown.createdMessage) return false;
      const timeRemaining = currentCooldown.time - Date.now();

      currentCooldown.createdMessage = true;

      setTimeout(() => {
        currentCooldown.createdMessage = false;
      }, 2000);

      ctx.worker.responses.small(ctx, ctx.worker.colors.RED, `You're on cooldown, try again in ${formatTime(timeRemaining)}`);
      return false;
    }

    ctx.invokeCooldown = () => {
      cooldowns.set(id, {
        time: Date.now() + ctx.command.cooldown!,
        timeout: setTimeout(() => {
          cooldowns.delete(id);
        }, ctx.command.cooldown)
      });
    };

    return true;
  };
};
