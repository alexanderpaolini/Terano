export default {
  CUSTOM: (str: string) => str,

  LOADING: 'Loading...',
  SERVER_ERROR: 'Internal Server Error',
  DEVELOPED_BY: 'Developed by MILLION#1321',

  ERROR: (err: string) => `**Error: ${err}**`,

  COOLDOWN: (time: string) => `This command is currently on cooldown.\nPlease try again in ${time}`,

  NO_PERMS_BOT: (perms: string[]) => `I'm missing the following permissions: ${perms.map(p => `\`${p}\``).join(', ')}`,
  NO_PERMS_USER: (perms: string[]) => `You're missing the following permissions: ${perms.map(p => `\`${p}\``).join(', ')}`,

  LANGUAGE: 'English (en-US)',
  CURRENT_LANGUAGE: 'Current language: `English (en-US)`',
  LANGUAGE_UPDATED: 'Language updated to: `English (en-US)`',
  NO_LANGUAGE: (lang: string, langs: string[]) => `\`${lang}\` is not a supported language.\nSupported languages: ${langs.map(x => '`' + x + '`').join(', ')}`,

  CMD_COLOR_NONE: 'No color was given.',
  CMD_COLOR_UNKNOWN: (color: string) => `I don't know the color \`${color}\``,
  CMD_COLOR_UPDATED: (color: string, name: string) => `Set card color to **${color}** (${name})`,
  CMD_COLOR_UPDATEDCUSTOM: (color: string) => `Set card color to **${color}**`,

  CMD_COOLDOWN_CURRENT: (cooldown: string) => `Current XP-cooldown is **${cooldown}s**.`,
  CMD_COOLDOWN_LOW: 'The XP-cooldown must 0 seconds or greater.',
  CMD_COOLDOWN_UPDATED: (old: string, newer: string) => `Changed XP-cooldown from \`${old}\`s to \`${newer}\`s.`,

  CMD_LEVELMESSAGE_ENABLED: 'Level-Up messages enabled',
  CMD_LEVELMESSAGE_DISABLED: 'Level-Up messages disabled',

  CMD_LEVELROLE_NOLEVEL: 'No level was given',
  CMD_LEVELROLE_NOTNUM: 'The level must be a number',
  CMD_LEVELROLE_TOOLOW: 'The level must be greater than zero (0)',
  CMD_LEVELROLE_NOROLE: 'No role was given.',
  CMD_LEVELROLE_NOTFOUND: 'Role was not found',
  CMD_LEVELROLE_NOPERMS: 'I cannot give members this role',
  CMD_LEVELROLE_SET: (role: string, level: string) => `Members will now get the role <@&${role}> when they are level \`${level}\``,

  CMD_LEVELMESSAGE_SHORT: 'Level-Up message must be shorter than 100 characters',
  CMD_LEVELMESSAGE_CURRENT: (msg: string) => `Current Level-Up message: \`${msg}\``,
  CMD_LEVELMESSAGE_SET: (msg: string) => `Level-Up message set to \`${msg}\``,

  CMD_TAG_NONE: 'No tag was given',
  CMD_TAG_LONG: 'Tag must be no longer than thirty (30) characters',
  CMD_TAG_UPDATED: (tag: string) => `Tag updated to \`${tag}\``,

  CMD_RATE_NONE: 'No XP-Multiplier was given',
  CMD_RATE_HIGH: 'The XP-Multiplier must be greater than 0',
  CMD_RATE_LOW: 'The XP-Multiplier must be no greater than 100',
  CMD_RATE_UPDATED: (old: string, newer: string) => `Changed XP-Multiplier from \`${old}\` to \`${newer}\``,

  CMD_HELP_NOCMD: (cmd: string) => `Command \`${cmd}\` not found`,

  CMD_EMBEDS_ENABLED: 'Enabled embeded messages',
  CMD_EMBEDS_DISABLED: 'Disabled embeded messages',

  CMD_PREFIX_CURRENT: (prefix: string) => `Current prefix: \`${prefix}\``,
  CMD_PREFIX_LONG: 'Prefix length must be no greater than 20 characters',
  CMD_PREFIX_UPDATED: (old: string, newer: string) => `Changed prefix from \`${old}\` to \`${newer}\``
} as Language
