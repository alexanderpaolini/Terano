import { Language } from '.'

export default {
  CUSTOM: (str: string) => 'undefined',
  ERROR: (str: string) => 'undefined',
  LOADING: 'undefined',
  SERVER_ERROR: 'undefined',
  DEVELOPED_BY: 'undefined',

  // Monitors

  RANK_UP: (role: string) => 'undefined',
  PREFIX_CURRENT: (prefix: string) => 'undefined',

  // Middleware

  NOT_OWNER: 'undefined',
  COOLDOWN: (time: string) => 'undefined',
  CMD_DISABLED: 'undefined',
  NO_PERMS_BOT: (perms: string[]) => 'undefined',
  NO_PERMS_USER: (perms: string[]) => 'undefined',

  // Language

  LANGUAGE: 'undefined',
  CURRENT_LANGUAGE: 'undefined',
  LANGUAGE_UPDATED: 'undefined',
  NO_LANGUAGE: (l: string, langs: string[]) => 'undefined',

  // Commands

  CMD_FROG_NAME: 'undefined',
  CMD_FROG_DESCRIPTION: 'undefined',
  CMD_FROG_USAGE: 'undefined',

  CMD_COLOR_NAME: 'undefined',
  CMD_COLOR_DESCRIPTION: 'undefined',
  CMD_COLOR_USAGE: 'undefined',
  CMD_COLOR_NONE: 'undefined',
  CMD_COLOR_UNKNOWN: (color: string) => 'undefined',
  CMD_COLOR_UPDATED: (color: string, name: string) => 'undefined',
  CMD_COLOR_UPDATEDCUSTOM: (color: string) => 'undefined',

  CMD_COOLDOWN_NAME: 'undefined',
  CMD_COOLDOWN_DESCRIPTION: 'undefined',
  CMD_COOLDOWN_USAGE: 'undefined',
  CMD_COOLDOWN_CURRENT: (cooldown: string) => 'undefined',
  CMD_COOLDOWN_LOW: 'undefined',
  CMD_COOLDOWN_UPDATED: (old: string, newer: string) => 'undefined',

  CMD_LEADERBOARD_NAME: 'undefined',
  CMD_LEADERBOARD_DESCRIPTION: 'undefined',
  CMD_LEADERBOARD_USAGE: 'undefined',

  CMD_LEVELMESSAGE_NAME: 'undefined',
  CMD_LEVELMESSAGE_DESCRIPTION: 'undefined',
  CMD_LEVELMESSAGE_USAGE: 'undefined',
  CMD_LEVELMESSAGE_ENABLED: 'undefined',
  CMD_LEVELMESSAGE_DISABLED: 'undefined',

  CMD_LEVELROLE_NAME: 'undefined',
  CMD_LEVELROLE_DESCRIPTION: 'undefined',
  CMD_LEVELROLE_USAGE: 'undefined',
  CMD_LEVELROLE_NOLEVEL: 'undefined',
  CMD_LEVELROLE_NOTNUM: 'undefined',
  CMD_LEVELROLE_TOOLOW: 'undefined',
  CMD_LEVELROLE_NOROLE: 'undefined',
  CMD_LEVELROLE_NOTFOUND: 'undefined',
  CMD_LEVELROLE_NOPERMS: 'undefined',
  CMD_LEVELROLE_SET: (role: string, level: string) => 'undefined',

  CMD_RANK_NAME: 'undefined',
  CMD_RANK_DESCRIPTION: 'undefined',
  CMD_RANK_USAGE: 'undefined',

  CMD_SETLEVELMESSAGE_NAME: 'undefined',
  CMD_SETLEVELMESSAGE_DESCRIPTION: 'undefined',
  CMD_SETLEVELMESSAGE_USAGE: 'undefined',
  CMD_SETLEVELMESSAGE_SHORT: 'undefined',
  CMD_SETLEVELMESSAGE_CURRENT: (msg: string) => 'undefined',
  CMD_SETLEVELMESSAGE_SET: (msg: string) => 'undefined',

  CMD_TAG_NAME: 'undefined',
  CMD_TAG_DESCRIPTION: 'undefined',
  CMD_TAG_USAGE: 'undefined',
  CMD_TAG_NONE: 'undefined',
  CMD_TAG_LONG: 'undefined',
  CMD_TAG_UPDATED: (tag: string) => 'undefined',

  CMD_RATE_NAME: 'undefined',
  CMD_RATE_DESCRIPTION: 'undefined',
  CMD_RATE_USAGE: 'undefined',
  CMD_RATE_NONE: 'undefined',
  CMD_RATE_HIGH: 'undefined',
  CMD_RATE_LOW: 'undefined',
  CMD_RATE_UPDATED: (old: string, newer: string) => 'undefined',

  CMD_HELP_NAME: 'undefined',
  CMD_HELP_DESCRIPTION: 'undefined',
  CMD_HELP_USAGE: 'undefined',
  CMD_HELP_COMMANDS: 'undefined',
  CMD_HELP_NOCMD: (cmd: string) => 'undefined',
  CMD_HELP_C: (c: string) => 'undefined',
  CMD_HELP_D: (d: string) => 'undefined',
  CMD_HELP_A: (a: string[]) => 'undefined',
  CMD_HELP_U: (u: string) => 'undefined',

  CMD_LIBRARY_NAME: 'undefined',
  CMD_LIBRARY_USAGE: 'undefined',
  CMD_LIBRARY_DESCRIPTION: 'undefined',

  CMD_PING_NAME: 'Ping',
  CMD_PING_DESCRIPTION: 'undefined',
  CMD_PING_USAGE: 'undefined',
  CMD_PING_PONG: (time: string) => 'undefined',

  CMD_STATS_NAME: 'undefined',
  CMD_STATS_DESCRIPTION: 'undefined',
  CMD_STATS_USAGE: 'undefined',

  CMD_STINKY_NAME: 'undefined',
  CMD_STINKY_DESCRIPTION: 'undefined',
  CMD_STINKY_USAGE: 'undefined',

  CMD_SUPPORT_NAME: 'undefined',
  CMD_SUPPORT_DESCRIPTION: 'undefined',
  CMD_SUPPORT_USAGE: 'undefined',

  CMD_VOTE_NAME: 'undefined',
  CMD_VOTE_DESCRIPTION: 'undefined',
  CMD_VOTE_USAGE: 'undefined',

  CMD_EMBEDS_NAME: 'undefined',
  CMD_EMBEDS_DESCRIPTION: 'undefined',
  CMD_EMBEDS_USAGE: 'undefined',
  CMD_EMBEDS_ENABLED: 'undefined',
  CMD_EMBEDS_DISABLED: 'undefined',

  CMD_LANG_NAME: 'undefined',
  CMD_LANG_DESCRIPTION: 'undefined',
  CMD_LANG_USAGE: 'undefined',

  CMD_PREFIX_NAME: 'undefined',
  CMD_PREFIX_DESCRIPTION: 'undefined',
  CMD_PREFIX_USAGE: 'undefined',
  CMD_PREFIX_LONG: 'undefined',
  CMD_PREFIX_UPDATED: (old: string, newer: string) => 'undefined',

  // Owner Commands

  CMD_BLACKLIST_NAME: 'undefined',
  CMD_BLACKLIST_DESCRIPTION: 'undefined',
  CMD_BLACKLIST_USAGE: 'undefined',
  CMD_BLACKLIST_NOUSER: 'undefined',
  CMD_BLACKLIST_NOSELF: 'undefined',
  CMD_BLACKLIST_ADDED: (user: string) => 'undefined',
  CMD_BLACKLIST_REMOVED: (user: string) => 'undefined',

  CMD_DEVMODE_NAME: 'undefined',
  CMD_DEVMODE_DESCRIPTION: 'undefined',
  CMD_DEVMODE_USAGE: 'undefined',
  CMD_DEVMODE_ENABLED: 'undefined',
  CMD_DEVMODE_DISABLED: 'undefined',

  CMD_DISABLE_NAME: 'undefined',
  CMD_DISABLE_DESCRIPTION: 'undefined',
  CMD_DISABLE_USAGE: 'undefined',
  CMD_DISABLE_NONE: 'undefined',
  CMD_DISABLE_NOTFOUND: (cmd: string) => 'undefined',
  CMD_DISABLE_ENABLED: (cmd: string) => 'undefined',
  CMD_DISABLE_DISABLED: (cmd: string) => 'undefined',

  CMD_EVAL_NAME: 'undefined',
  CMD_EVAL_DESCRIPTION: 'undefined',
  CMD_EVAL_USAGE: 'undefined',
  CMD_EVAL_SUCCESS: 'undefined',
  CMD_EVAL_UNSUCCESS: 'undefined',

  CMD_OWNER_NAME: 'undefined',
  CMD_OWNER_DESCRIPTION: 'undefined',
  CMD_OWNER_USAGE: 'undefined',
  CMD_OWNER_NOUSER: 'undefined',
  CMD_OWNER_NOSELF: 'undefined',
  CMD_OWNER_REMOVED: (user: string) => 'undefined',
  CMD_OWNER_ADDED: (user: string) => 'undefined',

  CMD_RESTART_NAME: 'Restart',
  CMD_RESTART_DESCRIPTION: 'undefined',
  CMD_RESTART_USAGE: 'undefined',
  CMD_RESTART_SHARD: (shard: string) => 'undefined',
  CMD_RESTART_NOSHARD: (shard: string) => 'undefined',
  CMD_RESTART_CLUSTER: (cluster: string) => 'undefined',
  CMD_RESTART_NOCLUSTER: (cluster: string) => 'undefined',
  CMD_RESTART_ALL: 'undefined',

  CMD_SWEEP_NAME: 'undefined',
  CMD_SWEEP_DESCRIPTION: 'undefined',
  CMD_SWEEP_USAGE: 'undefined',
  CMD_SWEEP: (ms: string) => 'undefined',

  CMD_THROW_NAME: 'undefined',
  CMD_THROW_DESCRIPTION: 'undefined',
  CMD_THROW_USAGE: 'undefined',

  // Categories

  CAT_FUN: 'undefined',
  CAT_LEVLEING: 'undefined',
  CAT_MISC: 'undefined',
  CAT_MODERATION: 'undefined',
  CAT_OWNER: 'undefined'
} as Language
