/**
 * The member level in the DB
 */
interface LevelDoc {
  /**
   * The guild that this level corresponds to
   */
  guildID: string,
  /**
   * The user with the level
   */
  userID: string,
  /**
   * How much xp they have
   */
  xp: string,
  /**
   * Their level
   */
  level: number;
}