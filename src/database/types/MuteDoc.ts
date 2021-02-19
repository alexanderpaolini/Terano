/**
 * The Mute document (for internal handling)
 */
interface MuteDoc {
  /**
   * The guild the mute was in
   */
  guildID: string;
  /**
   * The user who was muted
   */
  userID: string;
  /** 
   * Why the user was muted
   */
  reason: string;
  /**
   * When the user will be un-muted
   */
  timestamp: string;
  /** 
   * The moderator who muted
   */
  moderator: string;
}
