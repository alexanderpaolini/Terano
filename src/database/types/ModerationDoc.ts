/**
 * Moderation database document
 */
interface ModerationDoc {
/**
 * The ID of the guild it was in
 */
  guildID: string;
  /**
   * The case number
   */
  number: number;
  /**
   * Info about it
   */
  info: {
    /**
     * Who was the action on
     */
    member: string;
    /**
     * What was the acction
     */
    action: 'BAN' | 'KICK' | 'MUTE' | 'WARN';
    /**
     * What was the reason for the action
     */
    reason: string;
    /** 
     * The ID of the moderator who did the action
     */
    moderator: string;
    /**
     * The timesampt of the action
     */
    timestamp: string;
  };
  /**
   * The log stuff
   * This is for editing the message
   */
  log_message: {
    /**
     * The channel ID
     */
    channel: string;
    /**
     * The message ID
     */
    message: string;
  };
}
