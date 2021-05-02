export default {
  LOADING: 'Loading...',
  SERVER_ERROR: 'Internal Server Error',
  DEVELOPED_BY: 'Developed by MILLION#1321',

  LANGUAGE: 'English (en-US)',
  CURRENT_LANGUAGE: 'Current language: `English (en-US)`',
  LANGUAGE_UPDATED: 'Language updated to: `English (en-US)`',
  NO_LANGUAGE: '`{0}` is not a supported language',

  CMD_COLOR_NONE: 'No color was given.',
  CMD_COLOR_UNKNOWN: "I don't know the color `{0}`.",
  CMD_COLOR_UPDATED: 'Set card color to **{0}** ({1})',
  CMD_COLOR_UPDATEDCUSTOM: 'Set card color to **{0}**',

  CMD_COOLDOWN_CURRENT: 'Current XP-cooldown is **{0}s**.',
  CMD_COOLDOWN_LOW: 'The XP-cooldown must 0 seconds or greater.',
  CMD_COOLDOWN_UPDATED: 'Changed XP-cooldown from `{0}`s to `{1}`s.',

  CMD_LEVELMESSAGE_UPDATED: 'Level-Up messages {0}',

  CMD_LEVELROLE_NOLEVEL: 'No level was given',
  CMD_LEVELROLE_NOTNUM: 'The level must be a number',
  CMD_LEVELROLE_TOOLOW: 'The level must be greater than zero (0)',
  CMD_LEVELROLE_NOROLE: 'No role was given.',
  CMD_LEVELROLE_NOTFOUND: 'Role was not found',
  CMD_LEVELROLE_NOPERMS: 'I cannot give members this role',
  CMD_LEVELROLE_SET: 'Members will now get the role <@&{0}> when they are level `{0}`',

  CMD_LEVELMESSAGE_SHORT: 'Level-Up message must be shorter than 100 characters',
  CMD_LEVELMESSAGE_CURRENT: (msg: string) => `Current Level-Up message: \`${msg}\``,
  CMD_LEVELMESSAGE_SET: 'Level-Up message set to `{0}`',

  CMD_TAG_NONE: 'No tag was given',
  CMD_TAG_LONG: 'Tag must be no longer than thirty (30) characters',
  CMD_TAG_UPDATED: 'Tag updated to `{0}`',

  CMD_RATE_NONE: 'No XP-Multiplier was given',
  CMD_RATE_HIGH: 'The XP-Multiplier must be greater than 0',
  CMD_RATE_LOW: 'The XP-Multiplier must be no greater than 100',
  CMD_RATE_UPDATED: 'Changed XP-Multiplier from {0} to {1}',

  CMD_HELP_NOCMD: 'Command `{0}` not found',

  CMD_EMBEDS_UPDATED: '{0} embeded messages',

  CMD_PREFIX_CURRENT: 'Current prefix: `{0}`',
  CMD_PREFIX_LONG: 'Prefix length must be no greater than 20 characters',
  CMD_PREFIX_UPDATED: 'Changed prefix from `{0}` to `{1}`'
} as Language
