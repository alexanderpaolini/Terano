import { Language } from '.'

export default {
  CUSTOM: (str: string) => str,
  ERROR: (err: string) => `**Kesilapan: ${err}**`,
  LOADING: 'Loading...',
  SERVER_ERROR: 'Kesilapan Dalaman Server',
  DEVELOPED_BY: 'Dicipta oleh MILLION#1321',

  // Monitors

  RANK_UP: (role: string) => `Tahniah kerana level up! Anda sekarang mempunyai role <@&${role}>.`,
  PREFIX_CURRENT: (prefix: string) => `Prefix yang diset: \`${prefix}\``,

  // Middleware

  NOT_OWNER: 'Anda tidak boleh berbuat demikian.',
  COOLDOWN: (time: string) => `Kommand ini dalam cooldown.\nCuba lagi dalam ${time}`,
  CMD_DISABLED: 'Kommand is telah ditutup.',
  NO_PERMS_BOT: (perms: string[]) =>
    `Saya kekurangan permission ini: ${perms
      .map((p) => `\`${p}\``)
      .join(', ')}`,
  NO_PERMS_USER: (perms: string[]) =>
    `Anda kekurangan permission ini: ${perms
      .map((p) => `\`${p}\``)
      .join(', ')}`,

  // Language

  LANGUAGE: 'Malay (my-MY)',
  CURRENT_LANGUAGE: 'Bahasa yahng diset: `Malay (my-MY)`',
  LANGUAGE_UPDATED: 'Bahasa telah diset kepada: `Malay (my-MY)`',
  NO_LANGUAGE: (l: string, langs: string[]) =>
    `\`${l}\` bukan merupakan bahasa yang sah.\nBahasa yang sah: ${langs
      .map((x) => '`' + x + '`')
      .join(', ')}`,

  // Commands

  CMD_FROG_NAME: 'Katak',
  CMD_FROG_DESCRIPTION: 'Mendapatkan gambar kata..',
  CMD_FROG_USAGE: '',

  CMD_COLOR_NAME: 'Warna',
  CMD_COLOR_DESCRIPTION: 'Menukar warna kad rank anda.',
  CMD_COLOR_USAGE: '<warna>',
  CMD_COLOR_NONE: 'Tiada warna diberi.',
  CMD_COLOR_UNKNOWN: (color: string) => `Warna \`${color}\` bukan merupakan warna yang sah.`,
  CMD_COLOR_UPDATED: (color: string, name: string) => `Telah mengemas kini warna kad rank anda ke **${color}** (${name}).`,
  CMD_COLOR_UPDATEDCUSTOM: (color: string) => `Telah mengemas kini warna kad rank anda ke *${color}**.`,

  CMD_COOLDOWN_NAME: 'Cooldown XP',
  CMD_COOLDOWN_DESCRIPTION: 'Kemas kini Cooldown XP server.',
  CMD_COOLDOWN_USAGE: '<saat>',
  CMD_COOLDOWN_CURRENT: (cooldown: string) => `Cooldown XP yang diset adalah **${cooldown}s**.`,
  CMD_COOLDOWN_LOW: 'Cooldown XP perlu melebihi 0 saat.',
  CMD_COOLDOWN_UPDATED: (old: string, newer: string) => `Changed XP-cooldown from \`${old}\`s to \`${newer}\`s.`,

  CMD_LEADERBOARD_NAME: 'Leaderboard',
  CMD_LEADERBOARD_DESCRIPTION: 'Memaparkan leaderboard server.',
  CMD_LEADERBOARD_USAGE: '',

  CMD_LEVELMESSAGE_NAME: 'Togol Level-Up',
  CMD_LEVELMESSAGE_DESCRIPTION: 'Togol mesej Level-Up.',
  CMD_LEVELMESSAGE_USAGE: '',
  CMD_LEVELMESSAGE_ENABLED: 'Mesej Level-Up dibuka.',
  CMD_LEVELMESSAGE_DISABLED: 'Mesej Level-Up ditutup.',

  CMD_LEVELROLE_NAME: 'Role Level',
  CMD_LEVELROLE_DESCRIPTION: 'Mengemas kini role yang akan diberi apabila pengguna Level-Up.',
  CMD_LEVELROLE_USAGE: '<level> <ID | Mention Role>',
  CMD_LEVELROLE_NOLEVEL: 'Tiada level yang diberi.',
  CMD_LEVELROLE_NOTNUM: 'Level perlu merupakan nombor.',
  CMD_LEVELROLE_TOOLOW: 'Level perlu melebihi 0.',
  CMD_LEVELROLE_NOROLE: 'Tiada role yang diberi.',
  CMD_LEVELROLE_NOTFOUND: 'Role tidak dijumpai.',
  CMD_LEVELROLE_NOPERMS: 'Saya tidak boleh memberi pengguna role ini.',
  CMD_LEVELROLE_SET: (role: string, level: string) => `Pengguna akan mendapat role <@&${role}> apabila mereka level \`${level}\`.`,

  CMD_RANK_NAME: 'Rank',
  CMD_RANK_DESCRIPTION: 'Memaparkan rank anda dalam format kad.',
  CMD_RANK_USAGE: '[ID | Mention Pengguna]',

  CMD_SETLEVELMESSAGE_NAME: 'Mengemas kini mesej Level-Up',
  CMD_SETLEVELMESSAGE_DESCRIPTION: 'Mengemas kini mesej Level-Up server',
  CMD_SETLEVELMESSAGE_USAGE: '<teks>',
  CMD_SETLEVELMESSAGE_SHORT: 'Mesej Level-Up tidak boleh melebihi 100 karakter.',
  CMD_SETLEVELMESSAGE_CURRENT: (msg: string) => `Mesej Level-Up yang diset: \`${msg}\``,
  CMD_SETLEVELMESSAGE_SET: (msg: string) => `Mesej Level-Up telah diset kepada \`${msg}\`.`,

  CMD_TAG_NAME: 'Tag',
  CMD_TAG_DESCRIPTION: 'Kemas kini tag kad rank anda.',
  CMD_TAG_USAGE: '<tag baharu>',
  CMD_TAG_NONE: 'Tiada tag diberi.',
  CMD_TAG_LONG: 'Tag tidak boleh melebihi 30 karakter.',
  CMD_TAG_UPDATED: (tag: string) => `Tag telah diset kepada \`${tag}\`.`,

  CMD_RATE_NAME: 'Gandaan XP',
  CMD_RATE_DESCRIPTION: 'Kemas kini Gandaan XP server.',
  CMD_RATE_USAGE: '<gandaan>',
  CMD_RATE_NONE: 'Tiada Gandaan XP diberi.',
  CMD_RATE_HIGH: 'Gandaan XP perlu melebihi 0.',
  CMD_RATE_LOW: 'Gandaan XP tidak boleh melebihi 100.',
  CMD_RATE_UPDATED: (old: string, newer: string) => `Gandaan XP telah diset dari \`${old}\` kepada \`${newer}\`.`,

  CMD_HELP_NAME: 'Pertolongan',
  CMD_HELP_DESCRIPTION: 'Memaparkan senarai kommand atau maklumat kommand.',
  CMD_HELP_USAGE: '[kommand]',
  CMD_HELP_COMMANDS: 'Kommand-kommand',
  CMD_HELP_NOCMD: (cmd: string) => `Kommand \`${cmd}\` bukan merupakan kommand yang sah.`,
  CMD_HELP_C: (c: string) => `Kommand: **${c}**`,
  CMD_HELP_D: (d: string) => `Penerangan: ${d}`,
  CMD_HELP_A: (a: string[]) => `Alias: ${a.map((x) => `\`${x}\``).join(', ')}`,
  CMD_HELP_U: (u: string) => `Penggunaan: ${u}`,

  CMD_LIBRARY_NAME: 'Library',
  CMD_LIBRARY_USAGE: '',
  CMD_LIBRARY_DESCRIPTION: 'Memaparkan library bot.',

  CMD_PING_NAME: 'Ping',
  CMD_PING_DESCRIPTION: 'Mendapatkan ping bot.',
  CMD_PING_USAGE: '',
  CMD_PING_PONG: (time: string) => `Pong! ${time}`,

  CMD_STATS_NAME: 'Statistik',
  CMD_STATS_DESCRIPTION: 'Memaparkan statistik bot.',
  CMD_STATS_USAGE: '',

  CMD_STINKY_NAME: 'Stinky',
  CMD_STINKY_DESCRIPTION: 'Mendapatkan pengguna yang "stinky".',
  CMD_STINKY_USAGE: '',

  CMD_SUPPORT_NAME: 'Support',
  CMD_SUPPORT_DESCRIPTION: 'Memaparkan link invite ke server support bot.',
  CMD_SUPPORT_USAGE: '',

  CMD_VOTE_NAME: 'Undi',
  CMD_VOTE_DESCRIPTION: 'Memaparkan link untuk undi bot.',
  CMD_VOTE_USAGE: '',

  CMD_EMBEDS_NAME: 'Embeds',
  CMD_EMBEDS_DESCRIPTION: 'Membuka atau menutup mesej berembed.',
  CMD_EMBEDS_USAGE: '',
  CMD_EMBEDS_ENABLED: 'Mesej bermebed telah dibuka.',
  CMD_EMBEDS_DISABLED: 'Mesej berembed telah ditutup.',
  CMD_EMBEDS_ENABLED_NOPERMS: 'Telah membuka mesej berembed tetapi saya tidak mempunyai permission untuk menggunakannya.',

  CMD_LANG_NAME: 'Bahasa',
  CMD_LANG_DESCRIPTION: 'Kemas kini bahasa server.',
  CMD_LANG_USAGE: '[bahasa]',

  CMD_PREFIX_NAME: 'Prefiks',
  CMD_PREFIX_DESCRIPTION: 'Kemas kini prefiks bot.',
  CMD_PREFIX_USAGE: '[prefiks]',
  CMD_PREFIX_LONG: 'Prefiks tidak boleh melebihi 20 karakter.',
  CMD_PREFIX_UPDATED: (old: string, newer: string) => `Prefix telah diset dari \`${old}\` kepada \`${newer}\`.`,

  // Owner Commands

  CMD_BLACKLIST_NAME: 'Senarai Hitam',
  CMD_BLACKLIST_DESCRIPTION: 'Menambahkan suatu pengguna ke dalam senarai hitam.',
  CMD_BLACKLIST_USAGE: '<ID | Mention Pengguna>',
  CMD_BLACKLIST_NOUSER: 'Tiada pengguna diberi, tolong beri mention pengguna.',
  CMD_BLACKLIST_NOSELF: 'Anda tidak boleh meletakkan diri anda dalam senarai hitam.',
  CMD_BLACKLIST_ADDED: (user: string) => `<@${user}> telah diletakkan ke dalam senarai hitam.`,
  CMD_BLACKLIST_REMOVED: (user: string) => `<@${user}> telah dibuang dari senarai hitam.`,

  CMD_DEVMODE_NAME: 'Mod Developer',
  CMD_DEVMODE_DESCRIPTION: 'Buka atau tutup mod developer.',
  CMD_DEVMODE_USAGE: '',
  CMD_DEVMODE_ENABLED: 'Mod developer telah dibuka.',
  CMD_DEVMODE_DISABLED: 'Mod developer telah ditutup.',

  CMD_DISABLE_NAME: 'Tutup',
  CMD_DISABLE_DESCRIPTION: 'Tutup sesuatu kommand.',
  CMD_DISABLE_USAGE: '',
  CMD_DISABLE_NONE: 'Tiada kommand diberi, tolong beri sesuatu kommand.',
  CMD_DISABLE_NOTFOUND: (cmd: string) => `Kommand \`${cmd}\` merupakan kommand yang tidak sah.`,
  CMD_DISABLE_ENABLED: (cmd: string) => `Kommand \`${cmd}\` telah dibuka.`,
  CMD_DISABLE_DISABLED: (cmd: string) => `Kommand \`${cmd}\` telah ditutup.`,

  CMD_EVAL_NAME: 'Evaluasi',
  CMD_EVAL_DESCRIPTION: 'Mengevaluasi sesuatu kod.',
  CMD_EVAL_USAGE: '<kod>',
  CMD_EVAL_SUCCESS: 'Evaluasi Berjaya',
  CMD_EVAL_UNSUCCESS: 'Evaluasi Tidak Berjaya',

  CMD_OWNER_NAME: 'Pemilik',
  CMD_OWNER_DESCRIPTION: 'Set suatu pengguna sebagai pemilik bot.',
  CMD_OWNER_USAGE: '<ID | Mention Pengguna>',
  CMD_OWNER_NOUSER: 'Tiada pengguna diberi, tolong beri mention pengguna.',
  CMD_OWNER_NOSELF: 'Anda tidak boleh membuang diri anda daripada senarai pemilik.',
  CMD_OWNER_REMOVED: (user: string) => `<@${user}> telah dibuang daripada senarai pemilik.`,
  CMD_OWNER_ADDED: (user: string) => `<@${user}> telah diletakkan ke dalam senarai pemilik.`,

  CMD_RESTART_NAME: 'Restart',
  CMD_RESTART_DESCRIPTION: 'Restart bot.',
  CMD_RESTART_USAGE: '',
  CMD_RESTART_SHARD: (shard: string) => `Sedang restart Shard \`${shard}\`.`,
  CMD_RESTART_NOSHARD: (shard: string) => `Shard \`${shard}\` tidak dijumpai.`,
  CMD_RESTART_CLUSTER: (cluster: string) => `Sedang restart kluster \`${cluster}\`.`,
  CMD_RESTART_NOCLUSTER: (cluster: string) => `Kluster \`${cluster}\` tidak dijumpai.`,
  CMD_RESTART_ALL: 'Sedang restart...',

  CMD_SWEEP_NAME: 'Sweep',
  CMD_SWEEP_DESCRIPTION: 'Sweep (membersihkan) pangkalan data cache.',
  CMD_SWEEP_USAGE: '',
  CMD_SWEEP: (ms: string) => `Telah membersihkan pangkalan data cache.\nTelah ambil: \`${ms}\`ms`,

  CMD_THROW_NAME: 'Throw',
  CMD_THROW_DESCRIPTION: 'Membuat bot hantar (throw) kesilapan (error).',
  CMD_THROW_USAGE: '[teks]',

  // Categories

  CAT_FUN: 'Keseronokan',
  CAT_LEVELING: 'Leveling',
  CAT_MISC: 'Lain-lain',
  CAT_MODERATION: 'Moderation',
  CAT_OWNER: 'Pemilik'
} as Language
