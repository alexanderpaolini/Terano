export default {
  CUSTOM: (str: string) => str,
  // NOT_OWNER
  LOADING: 'Cargando...',
  SERVER_ERROR: 'Error de servidor interno',
  // CMD_DISABLED
  DEVELOPED_BY: 'Hecho por MILLION#1321',
  ERROR: (err: string) => `**Error: ${err}**`,
  // RANK_UP
  COOLDOWN: (time: string) => `Este comando se encuentra actualmente en enfriamiento.\nInténtelo de nuevo en ${time
      .replace('hour', 'hora')
      .replace('minute', 'minuto')
      .replace('second', 'segundo')
    }`,

  // NO_PERMS_BOT
  // NO_PERMS_USER

  LANGUAGE: 'Español (es-ES)',
  CURRENT_LANGUAGE: 'Establecer idioma: `Español (es-ES)`',
  LANGUAGE_UPDATED: 'El idioma cambió a: `Español (es-ES)`',
  NO_LANGUAGE: (lang: string, langs: string[]) => `\`${lang}\` es no un idioma agregado.\nIdiomas admitidos: ${langs.map(x => '`' + x + '`').join(', ')}`,

  CMD_COLOR_NONE: 'No se proporcionó color.',
  CMD_COLOR_UNKNOWN: 'No se el color verde `{0}`.',
  CMD_COLOR_UPDATED: 'Se cambió el color de la tarjeta a **{0}** ({1})',
  CMD_COLOR_UPDATEDCUSTOM: 'Se cambió el color de la tarjeta a **{0}** ({1})',

  CMD_COOLDOWN_CURRENT: 'El enfriamiento del nivel es de **{0}s**.',
  CMD_COOLDOWN_LOW: 'El tiempo de reutilización del nivel debe ser de 0 segundos o más.',
  CMD_COOLDOWN_UPDATED: 'Se cambió el tiempo de reutilizacion del nivel de `{0}`s a `{1}`s.',

  CMD_LEVELMESSAGE_ENABLED: 'Subir de nivel los mensajes establecidos en activado',
  CMD_LEVELMESSAGE_DISABLED: 'Subir de nivel los mensajes establecidos en discapacitado',

  CMD_LEVELROLE_NOLEVEL: 'No se dio ningún nivel',
  CMD_LEVELROLE_NOTNUM: 'El nivel debe ser un númbero',
  CMD_LEVELROLE_TOOLOW: 'El nivel debe ser mayor que (0)',
  CMD_LEVELROLE_NOROLE: 'No se dio ningún role',
  CMD_LEVELROLE_NOTFOUND: 'No se pudo encontrar el role',
  CMD_LEVELROLE_NOPERMS: 'No puedo darte este role',
  CMD_LEVELROLE_SET: 'Los miembros ahora obtendrán el role <@&{0}> cuando estén en el nivel `{0}`',

  CMD_LEVELMESSAGE_SHORT: 'El mensaje para subir de nivel debe tener menos de 100 caracteres',
  // CMD_LEVELMESSAGE_CURRENT
  CMD_LEVELMESSAGE_SET: 'El mensaje de subir de nivel cambió a `{0}`',

  CMD_TAG_NONE: 'No se proporcionó ninguna etiqueta',
  CMD_TAG_LONG: 'La eituqeta no debe tener más de treinta 30 caracteres',
  CMD_TAG_UPDATED: 'Cambiar etiqueta a `{0}`',

  CMD_RATE_NONE: 'No se proporciono ninguna tasa de cambió de nivel',
  CMD_RATE_HIGH: 'La tasa de cambió de nivel debe ser mayor que 0',
  CMD_RATE_LOW: 'La tasa de cambió de nivel debe ser menos a 100',
  CMD_RATE_UPDATED: (old: string, newer: string) => `Se cambió la tasa de cambo de nivel de ${old} a ${newer}`,

  CMD_HELP_NOCMD: (cmd: string) => `Comando ${cmd} no encontrado`,

  CMD_EMBEDS_ENABLED: 'Mensajes incrustados activado',
  CMD_EMBEDS_DISABLED: 'Mensajes incrustados discapacitado',

  PREFIX_CURRENT: 'Prefijo actual: `{0}`',
  CMD_PREFIX_LONG: 'La longitud del prefijo debe tener menos de 20 caracteres',
  CMD_PREFIX_UPDATED: 'Se cambió el prefijo de `{0}` a `{1}`'

  // CMD_BLACKLIST_NOUSER
  // CMD_BLACKLIST_NOSELF
  // CMD_BLOACKLIST_ADDED
  // CMD_BLACKLIST_REMOVED
  //
  // CMD_DEVMODE_ENABLED
  // CMD_DEVMODE_DISABLED
  //
  // CMD_DISABLE_NONE
  // CMD_DISABLE_NOTFOUND
  // CMD_DISABLE_ENABLED
  // CMD_DISABLE_DISABLED
  //
  // CMD_EVAL_SUCCESS
  // CMD_EVAL_UNSUCCESS
  //
  // CMD_OWNER_NOUSER
  // CMD_OWNER_NOSELF
  // CMD_OWNER_REMOVED
  // CMD_OWNER_ADDED
  //
  // CMD_RESTART_SHARD
  // CMD_RESTART_NOSHARD
  // CMD_RESTART_CLUSTER
  // CMD_RESTART_NOCLUSTER
  // CMD_RESTART_ALL
  //
  // CMD_SWEEP
} as Language
