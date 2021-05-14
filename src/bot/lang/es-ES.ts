// import { Language } from '.'

export default {
  CUSTOM: (str: string) => str,
  ERROR: (err: string) => `**Error: ${err}**`,
  LOADING: 'Cargando...',
  SERVER_ERROR: 'Error de servidor interno',
  DEVELOPED_BY: 'Hecho por MILLION#1321',

  // Monitors

  // RANK_UP
  PREFIX_CURRENT: 'Prefijo actual: `{0}`',

  // NOT_OWNER
  // CMD_DISABLED
  COOLDOWN: (time: string) => `Este comando se encuentra actualmente en enfriamiento.\nInténtelo de nuevo en ${time
    .replace('hour', 'hora')
    .replace('minute', 'minuto')
    .replace('second', 'segundo')
    }`,
  // NO_PERMS_BOT
  // NO_PERMS_USER

  // Language

  LANGUAGE: 'Español (es-ES)',
  CURRENT_LANGUAGE: 'Establecer idioma: `Español (es-ES)`',
  LANGUAGE_UPDATED: 'El idioma cambió a: `Español (es-ES)`',
  NO_LANGUAGE: (lang: string, langs: string[]) => `\`${lang}\` es no un idioma agregado.\nIdiomas admitidos: ${langs.map(x => '`' + x + '`').join(', ')}`,

  // Commands

  // CMD_FROG_NAME
  // CMD_FROG_DESCRIPTION
  // CMD_FROG_USAGE

  // CMD_COLOR_NAME
  // CMD_COLOR_DESCRIPTION
  // CMD_COLOR_USAGE
  CMD_COLOR_NONE: 'No se proporcionó color.',
  CMD_COLOR_UNKNOWN: 'No se el color verde `{0}`.',
  CMD_COLOR_UPDATED: 'Se cambió el color de la tarjeta a **{0}** ({1})',
  CMD_COLOR_UPDATEDCUSTOM: 'Se cambió el color de la tarjeta a **{0}** ({1})',

  // CMD_COOLDOWN_NAME
  // CMD_COOLDOWN_DESCRIPTION
  // CMD_COOLDOWN_USAGE
  CMD_COOLDOWN_CURRENT: 'El enfriamiento del nivel es de **{0}s**.',
  CMD_COOLDOWN_LOW: 'El tiempo de reutilización del nivel debe ser de 0 segundos o más.',
  CMD_COOLDOWN_UPDATED: 'Se cambió el tiempo de reutilizacion del nivel de `{0}`s a `{1}`s.',

  // CMD_LEADERBOARD_NAME
  // CMD_LEADERBOARD_DESCRIPTION
  // CMD_LEADERBOARD_USAGE

  // CMD_LEVELROLE_NAME
  // CMD_LEVELROLE_NAME
  // CMD_LEVELROLE_NAME
  CMD_LEVELMESSAGE_ENABLED: 'Subir de nivel los mensajes establecidos en activado',
  CMD_LEVELMESSAGE_DISABLED: 'Subir de nivel los mensajes establecidos en discapacitado',

  // CMD_LEVELROLE_NAME
  // CMD_LEVELROLE_DESCRIPTION
  // CMD_LEVELROLE_USAGE
  CMD_LEVELROLE_NOLEVEL: 'No se dio ningún nivel',
  CMD_LEVELROLE_NOTNUM: 'El nivel debe ser un númbero',
  CMD_LEVELROLE_TOOLOW: 'El nivel debe ser mayor que (0)',
  CMD_LEVELROLE_NOROLE: 'No se dio ningún role',
  CMD_LEVELROLE_NOTFOUND: 'No se pudo encontrar el role',
  CMD_LEVELROLE_NOPERMS: 'No puedo darte este role',
  CMD_LEVELROLE_SET: 'Los miembros ahora obtendrán el role <@&{0}> cuando estén en el nivel `{0}`',

  // CMD_RANK_NAME
  // CMD_RANK_DESCRIPTION
  // CMD_RANK_USAGE

  // CMD_SETLEVELMESSAGE_NAME
  // CMD_SETLEVELMESSAGE_DESCRIPTION
  // CMD_SETLEVEL_USAGE
  CMD_LEVELMESSAGE_SHORT: 'El mensaje para subir de nivel debe tener menos de 100 caracteres',
  // CMD_LEVELMESSAGE_CURRENT: (msg: strring) => ``
  CMD_LEVELMESSAGE_SET: 'El mensaje de subir de nivel cambió a `{0}`',

  // CMD_TAG_NAME
  // CMD_TAG_DESCRIPTION
  // CMD_TAG_USAGE
  CMD_TAG_NONE: 'No se proporcionó ninguna etiqueta',
  CMD_TAG_LONG: 'La eituqeta no debe tener más de treinta 30 caracteres',
  CMD_TAG_UPDATED: 'Cambiar etiqueta a `{0}`',

  // CMD_RATE_NAME
  // CMD_RATE_DESCRIPTION
  // CMD_RATE_USAGE
  CMD_RATE_NONE: 'No se proporciono ninguna tasa de cambió de nivel',
  CMD_RATE_HIGH: 'La tasa de cambió de nivel debe ser mayor que 0',
  CMD_RATE_LOW: 'La tasa de cambió de nivel debe ser menos a 100',
  CMD_RATE_UPDATED: (old: string, newer: string) => `Se cambió la tasa de cambo de nivel de ${old} a ${newer}`,

  // CMD_HELP_NAME
  // CMD_HELP_DESCRIPTION
  // CMD_HELP_USAGE
  // CMD_HELP_COMMANDS
  CMD_HELP_NOCMD: (cmd: string) => `Comando ${cmd} no encontrado`,
  // CMD_HELP_C: (c: string) => ``,
  // CMD_HELP_D: (d: string) => ``,
  // CMD_HELP_A: (a: string[]) => ``,
  // CMD_HELP_U: (u: string) => ``,

  // CMD_LIBRARY_NAME
  // CMD_LIBRARY_USAGE
  // CMD_LIBRARY_DESCRIPTION

  // CMD_PING_NAME
  // CMD_PING_DESCRIPTION
  // CMD_PING_USAGE
  // CMD_PING_PONG: (time: string) => ``

  // CMD_STATS_NAME
  // CMD_STATS_DESCRIPTION
  // CMD_STATS_USAGE

  // CMD_STINKY_NAME
  // CMD_STINKY_DESCRIPTION
  // CMD_STINKY_USAGE

  // CMD_SUPPORT_NAME
  // CMD_SUPPORT_DESCRIPTION
  // CMD_SUPPORT_USAGE

  // CMD_VOTE_NAME
  // CMD_VOTE_DESCRIPTION
  // CMD_VOTE_USAGE

  // CMD_EMBEDS_NAME
  // CMD_EMBEDS_DESCRIPTION
  // CMD_EMBEDS_USAGE
  CMD_EMBEDS_ENABLED: 'Mensajes incrustados activado',
  CMD_EMBEDS_DISABLED: 'Mensajes incrustados discapacitado',
  // CMD_EMBEDS_ENABLED_NOPERMS

  // CMD_LANG_NAME
  // CMD_LANG_DESCRIPTION
  // CMD_LANG_USAGE

  // CMD_PREFIX_NAME
  // CMD_PREFIX_DESCRIPTION
  // CMD_PREFIX_USAGE
  CMD_PREFIX_LONG: 'La longitud del prefijo debe tener menos de 20 caracteres',
  CMD_PREFIX_UPDATED: 'Se cambió el prefijo de `{0}` a `{1}`'

  // Owner Commands

  // CMD_BLACKLIST_NAME
  // CMD_BLACKLIST_DESCRIPTION
  // CMD_BLACKLIST_USAGE
  // CMD_BLACKLIST_NOUSER
  // CMD_BLACKLIST_NOSELF
  // CMD_BLACKLIST_ADDED
  // CMD_BLACKLIST_REMOVED

  // CMD_DEVMODE_NAME
  // CMD_DEVMODE_DESCRIPTION
  // CMD_DEVMODE_USAGE
  // CMD_DEVMODE_ENABLED
  // CMD_DEVMODE_DISABLED

  // CMD_DISABLE_NAME
  // CMD_DISABLE_DESCRIPTION
  // CMD_DISABLE_USAGE
  // CMD_DISABLE_NONE
  // CMD_DISABLE_NOTFOUND
  // CMD_DISABLE_ENABLED
  // CMD_DISABLE_DISABLED

  // CMD_EVAL_NAME
  // CMD_EVAL_DESCRIPTION
  // CMD_EVAL_USAGE
  // CMD_EVAL_SUCCESS
  // CMD_EVAL_UNSUCCESS

  // CMD_OWNER_NAME
  // CMD_OWNER_DESCRIPTION
  // CMD_OWNER_USAGE
  // CMD_OWNER_NOUSER
  // CMD_OWNER_NOSELF
  // CMD_OWNER_REMOVED
  // CMD_OWNER_ADDED

  // CMD_RESTART_NAME
  // CMD_RESTART_DESCRIPTION
  // CMD_RESTART_USAGE
  // CMD_RESTART_SHARD
  // CMD_RESTART_NOSHARD
  // CMD_RESTART_CLUSTER
  // CMD_RESTART_NOCLUSTER
  // CMD_RESTART_ALL

  // CMD_SWEEP_NAME
  // CMD_SWEEP_DESCRIPTION
  // CMD_SWEEP_USAGE
  // CMD_SWEEP

  // CMD_THROW_NAME
  // CMD_THROW_DESCRIPTION
  // CMD_THROW_USAGE

  // Categories

  // CAT_FUN
  // CAT_LEVELING
  // CAT_MISC
  // CAT_OWNER
  // CAT_MODERATION
} as any
