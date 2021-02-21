/**
 * The Guild options
 */
interface GuildDoc {
  /**
   * Guild ID
   */
  id: string;
  /**
   * Basic options
   */
  options: {
    /**
     * Guild Prefix
     */
    prefix: string;
    /**
     * Whether or not to send in embeds
     */
    embeds: boolean;
    /**
     * Whether or not to send no-permissions messages
     */
    no_permissions: boolean;
  };
  /**
   * Leveling options
   */
  level: {
    /**
     * The delay between gaining xp
     */
    cooldown: number;
    /**
     * The XP Multplier
     */
    xp_multplier: number;
    /**
     * Whether or not to send the level message
     */
    send_level_message: boolean;
    /**
     * The Level-Up message to be sent
     */
    level_message: string;
    /**
     * the default color of a rank card
     */
    default_color: string;
    /**
     * Automatic roles on levels
     */
    level_roles: LevelRole[];
  };
  /**
   * Moderation settings
   */
  moderation: {
    /**
     * The id of the role to give when muting
     */
    mute_role: string;
    /**
     * The channel to send logs
     */
    log_channel: string;
    /**
     * The auto role options
     */
    auto_role: AutoRole[]
  };
}

/**
 * The auto role options
 */
interface LevelRole {
  /**
   * The ID of the string
   */
  id: string;
  /**
   * The level for it to be given on
   */
  level: number;
}


/**
 * The auto role options
 */
interface AutoRole {
  /**
   * The ID of the role
   */
  id: string;
  /**
   * How long to wait before giving it (in miliseconds)
   */
  delay: number;
}