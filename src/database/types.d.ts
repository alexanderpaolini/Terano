/**
 * The Guild options
 */
interface GuildDoc {
  /**
   * Guild ID
   */
  id: Snowflake
  /**
   * Basic options
   */
  options: {
    /**
     * Guild Prefix
     */
    prefix: string
    /**
     * Whether or not to send in embeds
     */
    embeds: boolean
    /**
     * Whether or not to send no-permissions messages
     */
    no_permissions: boolean
    /**
     * What language to respond in
     */
    lang: string
  }
  /**
   * Leveling options
   */
  level: {
    /**
     * The delay between gaining xp
     */
    cooldown: string
    /**
     * The XP Multplier
     */
    xp_multplier: number
    /**
     * Whether or not to send the level message
     */
    send_level_message: boolean
    /**
     * The Level-Up message to be sent
     */
    level_message: string
    /**
     * the default color of a rank card
     */
    default_color: string
    /**
     * Automatic roles on levels
     */
    level_roles: LevelRole[]
  }
  /**
   * Moderation settings
   */
  moderation: {
    /**
     * The id of the role to give when muting
     */
    mute_role: string
    /**
     * The channel to send logs
     */
    log_channel: string
    /**
     * The auto role options
     */
    auto_role: AutoRole[]
  }
}

/**
 * The auto role options
 */
interface LevelRole {
  /**
   * The ID of the string
   */
  id: string
  /**
   * The level for it to be given on
   */
  level: number
}

/**
 * The auto role options
 */
interface AutoRole {
  /**
   * The ID of the role
   */
  id: string
  /**
   * How long to wait before giving it (in miliseconds)
   */
  delay: number
}

/**
 * Moderation database document
 */
interface ModerationDoc {
  /**
   * The ID of the guild it was in
   */
  guildID: string
  /**
   * The case number
   */
  number: number
  /**
   * Info about it
   */
  info: {
    /**
     * Who was the action on
     */
    member: string
    /**
     * What was the acction
     */
    action: 'BAN' | 'KICK' | 'MUTE' | 'WARN'
    /**
     * What was the reason for the action
     */
    reason: string
    /**
     * The ID of the moderator who did the action
     */
    moderator: string
    /**
     * The timesampt of the action
     */
    timestamp: string
  }
  /**
   * The log stuff
   * This is for editing the message
   */
  log_message: {
    /**
     * The channel ID
     */
    channel: string
    /**
     * The message ID
     */
    message: string
  }
}

/**
 * User Vote Document in the DB
 */
interface VoteDoc {
  /**
   * The ID of the user
   */
  id: string
  /**
   * The total amount of times the user has voted
   */
  total_votes: number
  /**
   * How many votes the votes were worth (weekends are worth 2x)
   */
  votes_worth: number
  /**
   * Array of votes
   */
  votes: Vote[]
}

/**
 * A vote
 */
interface Vote {
  /**
   * When the vote was made
   */
  date: string
  /**
   * How much it is worth (1: normal, 2: weekends)
   */
  worth: 1 | 2
  /**
   * How many votes before this
   */
  number?: number
  /**
   * Query if there
   */
  query?: string | {
    [key: string]: string
  }
  /**
   * Which bot it was for
   */
  bot: string
}

/**
 * The User Info
 */
interface InfoDoc {
  /**
   * The ID of the user
   */
  id: string
  /**
   * Whether or not the user is an owner
   */
  owner: boolean
  /**
   * Whether or not the user is blacklisted
   */
  blacklisted: boolean
}

/**
 * The member level in the DB
 */
interface LevelDoc {
  /**
   * The guild that this level corresponds to
   */
  guildID: string
  /**
   * The user with the level
   */
  userID: string
  /**
   * How much xp they have
   */
  xp: string
  /**
   * Their level
   */
  level: number
}

/**
 * OAuth2 Data from the db
 */
interface OAuth2Doc {
  /**
   * The user's id
   */
  id: string
  /**
   * The generated token for API requests
   */
  token: string
  /**
   * Bearer token for requests
   */
  bearer: string
  /**
   * Avatar URL
   */
  avatar: string
  /**
   * Email?
   */
  email?: string
}

/**
 * The Mute document (for internal handling)
 */
interface MuteDoc {
  /**
   * The guild the mute was in
   */
  guildID: string
  /**
   * The user who was muted
   */
  userID: string
  /**
   * Why the user was muted
   */
  reason: string
  /**
   * When the user will be un-muted
   */
  timestamp: string
  /**
   * The moderator who muted
   */
  moderator: string
}

/**
 * User Settings document in the DB
 */
interface SettingsDoc {
  /**
   * The ID of the user
   */
  id: string
  /**
   * Configuration of the rank card
   */
  level: {
    /**
     * The Tag displayed
     */
    tag: string
    /**
     * The color of the card (hex format)
     */
    color: string
    /**
     * The picture that will be displayed
     */
    picture: string
  }
}
