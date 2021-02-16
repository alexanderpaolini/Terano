import { CommandOptions } from 'discord-rose/dist/typings/lib';

import fetch from 'node-fetch';

import queryString from 'querystring';

import { APIGuildMember } from 'discord-api-types';

export default {
  name: 'Rank',
  usage: 'rank [mention]',
  description: 'View your rank in a card format.',
  category: 'leveling',
  command: 'rank',
  aliases: ['card', 'level'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    const user = (await ctx.worker.api.members.get(ctx.guild.id, (ctx.args[0] || '').replace(/[<@!>]/g, '') as any).catch(() => null as APIGuildMember))?.user || ctx.message.author;
    const data = await ctx.worker.db.userDB.getLevel(user.id, ctx.message.guild_id);
    const settings = await ctx.worker.db.userDB.getSettings(user.id);

    const currLevel = data.level;
    const currXp = data.xp;
    const nextXp = Math.floor(100 + 5 / 6 * currLevel * (2 * currLevel * currLevel + 27 * currLevel + 91));

    const tag = settings?.level.tag || '─────────────────';
    const pfp = settings?.level.picture || `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    const color = settings?.level.color || '#07bb5b';

    const res = await fetch(`http://localhost:3001/card/${encodeURIComponent(color)}/${currLevel}/${currXp}/${nextXp}/${encodeURIComponent(pfp)}/${encodeURIComponent(tag)}/${encodeURIComponent(`${user.username}#${user.discriminator}`)}`);

    const buffer = await res.buffer();
    ctx.sendFile({ name: 'rank.png', buffer: buffer });
  }
} as CommandOptions;
