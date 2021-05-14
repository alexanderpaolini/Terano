const lang = {
  CUSTOM: (str: string) => str,
  ERROR: (err: string) => `**Error: ${err}**`,
  LOADING: 'Loading...',
  SERVER_ERROR: 'Internal Server Error',
  DEVELOPED_BY: 'Developed by MILLION#1321',

  // Monitors

  RANK_UP: (role: string) => `Congrats on leveling up! You now have the role <@&${role}>`,
  PREFIX_CURRENT: (prefix: string) => `Current prefix: \`${prefix}\``,

  // Middleware

  NOT_OWNER: 'You can\'t do this, silly.',
  COOLDOWN: (time: string) => `This command is currently on cooldown.\nPlease try again in ${time}`,
  CMD_DISABLED: 'This command is currently disabled',
  NO_PERMS_BOT: (perms: string[]) => `I'm missing the following permissions: ${perms.map(p => `\`${p}\``).join(', ')}`,
  NO_PERMS_USER: (perms: string[]) => `You're missing the following permissions: ${perms.map(p => `\`${p}\``).join(', ')}`,

  // Language

  LANGUAGE: 'English (en-US)',
  CURRENT_LANGUAGE: 'Current language: `English (en-US)`',
  LANGUAGE_UPDATED: 'Language updated to: `English (en-US)`',
  NO_LANGUAGE: (l: string, langs: string[]) => `\`${l}\` is not a supported language.\nSupported languages: ${langs.map(x => '`' + x + '`').join(', ')}`,

  // Commands

  CMD_FROG_NAME: 'Frog',
  CMD_FROG_DESCRIPTION: 'Get a picture of a frog',
  CMD_FROG_USAGE: 'frog',

  CMD_COLOR_NAME: 'Color',
  CMD_COLOR_DESCRIPTION: 'Set your rank card color',
  CMD_COLOR_USAGE: '<color>',
  CMD_COLOR_NONE: 'No color was given.',
  CMD_COLOR_UNKNOWN: (color: string) => `I don't know the color \`${color}\``,
  CMD_COLOR_UPDATED: (color: string, name: string) => `Set card color to **${color}** (${name})`,
  CMD_COLOR_UPDATEDCUSTOM: (color: string) => `Set card color to **${color}**`,

  CMD_COOLDOWN_NAME: 'XP-Cooldown',
  CMD_COOLDOWN_DESCRIPTION: 'Set the guild\'s XP-Cooldown',
  CMD_COOLDOWN_USAGE: '<seconds>',
  CMD_COOLDOWN_CURRENT: (cooldown: string) => `Current XP-cooldown is **${cooldown}s**.`,
  CMD_COOLDOWN_LOW: 'The XP-cooldown must 0 seconds or greater.',
  CMD_COOLDOWN_UPDATED: (old: string, newer: string) => `Changed XP-cooldown from \`${old}\`s to \`${newer}\`s.`,

  CMD_LEADERBOARD_NAME: 'Leaderboard',
  CMD_LEADERBOARD_DESCRIPTION: 'View the guild\'s leaderboard',
  CMD_LEADERBOARD_USAGE: '',

  CMD_LEVELMESSAGE_NAME: 'Level-Up Toggle',
  CMD_LEVELMESSAGE_DESCRIPTION: 'Toggle the Level-Up messages',
  CMD_LEVELMESSAGE_USAGE: '',
  CMD_LEVELMESSAGE_ENABLED: 'Level-Up messages enabled',
  CMD_LEVELMESSAGE_DISABLED: 'Level-Up messages disabled',

  CMD_LEVELROLE_NAME: 'Level Role',
  CMD_LEVELROLE_DESCRIPTION: 'Set a role to be given on Level-Up',
  CMD_LEVELROLE_USAGE: '<level> <ID | Role Mention>',
  CMD_LEVELROLE_NOLEVEL: 'No level was given',
  CMD_LEVELROLE_NOTNUM: 'The level must be a number',
  CMD_LEVELROLE_TOOLOW: 'The level must be greater than zero (0)',
  CMD_LEVELROLE_NOROLE: 'No role was given.',
  CMD_LEVELROLE_NOTFOUND: 'Role was not found',
  CMD_LEVELROLE_NOPERMS: 'I cannot give members this role',
  CMD_LEVELROLE_SET: (role: string, level: string) => `Members will now get the role <@&${role}> when they are level \`${level}\``,

  CMD_RANK_NAME: 'Rank',
  CMD_RANK_DESCRIPTION: 'View your rank in a card format',
  CMD_RANK_USAGE: '[ID | User Mention]',

  CMD_SETLEVELMESSAGE_NAME: 'Set Level-Up Message',
  CMD_SETLEVELMESSAGE_DESCRIPTION: 'Set the guild\'s Level-Up Message',
  CMD_SETLEVELMESSAGE_USAGE: '<text>',
  CMD_SETLEVELMESSAGE_SHORT: 'Level-Up message must be shorter than 100 characters',
  CMD_SETLEVELMESSAGE_CURRENT: (msg: string) => `Current Level-Up message: \`${msg}\``,
  CMD_SETLEVELMESSAGE_SET: (msg: string) => `Level-Up message set to \`${msg}\``,

  CMD_TAG_NAME: 'Tag',
  CMD_TAG_DESCRIPTION: 'Set your rank card tag',
  CMD_TAG_USAGE: '<new tag>',
  CMD_TAG_NONE: 'No tag was given',
  CMD_TAG_LONG: 'Tag must be no longer than thirty (30) characters',
  CMD_TAG_UPDATED: (tag: string) => `Tag updated to \`${tag}\``,

  CMD_RATE_NAME: 'XP-Multiplier',
  CMD_RATE_DESCRIPTION: 'Set the guild\'s XP-Multiplier',
  CMD_RATE_USAGE: '<multiplier>',
  CMD_RATE_NONE: 'No XP-Multiplier was given',
  CMD_RATE_HIGH: 'The XP-Multiplier must be greater than 0',
  CMD_RATE_LOW: 'The XP-Multiplier must be no greater than 100',
  CMD_RATE_UPDATED: (old: string, newer: string) => `Changed XP-Multiplier from \`${old}\` to \`${newer}\``,

  CMD_HELP_NAME: 'Help',
  CMD_HELP_DESCRIPTION: 'Get the list of commands or help on a command',
  CMD_HELP_USAGE: '[command]',
  CMD_HELP_COMMANDS: 'Commands',
  CMD_HELP_NOCMD: (cmd: string) => `Command \`${cmd}\` not found`,
  CMD_HELP_C: (c: string) => `Command: **${c}**`,
  CMD_HELP_D: (d: string) => `Description: ${d}`,
  CMD_HELP_A: (a: string[]) => `Aliases: ${a.map(x => `\`${x}\``).join(', ')}`,
  CMD_HELP_U: (u: string) => `Usage: ${u}`,

  CMD_LIBRARY_NAME: 'Library',
  CMD_LIBRARY_USAGE: '',
  CMD_LIBRARY_DESCRIPTION: 'Get the bot\'s library',

  CMD_PING_NAME: 'Ping',
  CMD_PING_DESCRIPTION: 'Get the bot\'s ping',
  CMD_PING_USAGE: '',
  CMD_PING_PONG: (time: string) => `Pong! ${time}`,

  CMD_STATS_NAME: 'Stats',
  CMD_STATS_DESCRIPTION: 'Get the bot\'s stats',
  CMD_STATS_USAGE: '',

  CMD_STINKY_NAME: 'Stnky',
  CMD_STINKY_DESCRIPTION: 'Get the stinky user',
  CMD_STINKY_USAGE: '',

  CMD_SUPPORT_NAME: 'Support',
  CMD_SUPPORT_DESCRIPTION: 'Get the link to the bot\'s support server',
  CMD_SUPPORT_USAGE: '',

  CMD_VOTE_NAME: 'Vote',
  CMD_VOTE_DESCRIPTION: 'Get the link to vote for the bot',
  CMD_VOTE_USAGE: '',

  CMD_EMBEDS_NAME: 'Embeds',
  CMD_EMBEDS_DESCRIPTION: 'Enable or disable embedded messages',
  CMD_EMBEDS_USAGE: '',
  CMD_EMBEDS_ENABLED: 'Enabled embeded messages',
  CMD_EMBEDS_DISABLED: 'Disabled embeded messages',
  CMD_EMBEDS_ENABLED_NOPERMS: 'Enabled embedded messages but I don\'t have permissions to use them',

  CMD_LANG_NAME: 'Language',
  CMD_LANG_DESCRIPTION: 'Set the guild\'s language',
  CMD_LANG_USAGE: '[lang]',

  CMD_PREFIX_NAME: 'Prefix',
  CMD_PREFIX_DESCRIPTION: 'Set the bot\'s prefix',
  CMD_PREFIX_USAGE: '[prefix]',
  CMD_PREFIX_LONG: 'Prefix length must be no greater than 20 characters',
  CMD_PREFIX_UPDATED: (old: string, newer: string) => `Changed prefix from \`${old}\` to \`${newer}\``,

  // Owner Commands

  CMD_BLACKLIST_NAME: 'Blacklist',
  CMD_BLACKLIST_DESCRIPTION: 'Blacklist a user from using the bot',
  CMD_BLACKLIST_USAGE: '<ID | User Mention>',
  CMD_BLACKLIST_NOUSER: 'No user was given, please mention a user.',
  CMD_BLACKLIST_NOSELF: 'You canno tblacklist yourself',
  CMD_BLACKLIST_ADDED: (user: string) => `<@${user}> is now blacklisted`,
  CMD_BLACKLIST_REMOVED: (user: string) => `<@${user}> is no longer blacklisted`,

  CMD_DEVMODE_NAME: 'Developer-Only Mode',
  CMD_DEVMODE_DESCRIPTION: 'Enable or disable developer-only mode',
  CMD_DEVMODE_USAGE: '',
  CMD_DEVMODE_ENABLED: 'Enabled developer-only mode',
  CMD_DEVMODE_DISABLED: 'Disabled developer-only mode',

  CMD_DISABLE_NAME: 'Disable',
  CMD_DISABLE_DESCRIPTION: 'Disable a command',
  CMD_DISABLE_USAGE: '',
  CMD_DISABLE_NONE: 'No command was given, please include a command',
  CMD_DISABLE_NOTFOUND: (cmd: string) => `\`${cmd}\` is not a valid command`,
  CMD_DISABLE_ENABLED: (cmd: string) => `Enabled \`${cmd}\``,
  CMD_DISABLE_DISABLED: (cmd: string) => `Disabled \`${cmd}\``,

  CMD_EVAL_NAME: 'Eval',
  CMD_EVAL_DESCRIPTION: 'Eval some code',
  CMD_EVAL_USAGE: '<code>',
  CMD_EVAL_SUCCESS: 'Eval Successful',
  CMD_EVAL_UNSUCCESS: 'Eval Unsuccessful',

  CMD_OWNER_NAME: 'Owner',
  CMD_OWNER_DESCRIPTION: 'Set a user as bot owner',
  CMD_OWNER_USAGE: '<ID | User Mention>',
  CMD_OWNER_NOUSER: 'No user was given, please mention a user',
  CMD_OWNER_NOSELF: 'You cannot remove yourself from owner',
  CMD_OWNER_REMOVED: (user: string) => `<@${user}> is no longer a bot owner`,
  CMD_OWNER_ADDED: (user: string) => `<@${user}> is now a bot owner`,

  CMD_RESTART_NAME: 'Restart',
  CMD_RESTART_DESCRIPTION: 'Restart the bot',
  CMD_RESTART_USAGE: '',
  CMD_RESTART_SHARD: (shard: string) => `Restarting Shard \`${shard}\``,
  CMD_RESTART_NOSHARD: (shard: string) => `Shard \`${shard}\` does not exist`,
  CMD_RESTART_CLUSTER: (cluster: string) => `Restarting Cluster \`${cluster}\``,
  CMD_RESTART_NOCLUSTER: (cluster: string) => `Cluster \`${cluster}\` does not exist`,
  CMD_RESTART_ALL: 'Restarting...',

  CMD_SWEEP_NAME: 'Sweep',
  CMD_SWEEP_DESCRIPTION: 'Sweep database cache',
  CMD_SWEEP_USAGE: '',
  CMD_SWEEP: (ms: string) => `Swept Cache\nTook: \`${ms}\`ms`,

  CMD_THROW_NAME: 'Throw',
  CMD_THROW_DESCRIPTION: 'Make the bot handle an error',
  CMD_THROW_USAGE: '[text]',

  // Categories

  CAT_FUN: 'Fun',
  CAT_LEVELING: 'Leveling',
  CAT_MISC: 'Misc',
  CAT_MODERATION: 'Moderation',
  CAT_OWNER: 'Owner'
}

export default lang
