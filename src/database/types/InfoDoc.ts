/**
 * The User Info
 */
interface InfoDoc {
  /**
   * The ID of the user
   */
  id: string,
  /**
   * Whether or not the user is an owner
   */
  owner: boolean,
  /**
   * Whether or not the user is blacklisted
   */
  blacklisted: boolean;
}
