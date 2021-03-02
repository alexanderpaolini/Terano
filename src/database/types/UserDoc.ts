/**
 * User Settings document in the DB
 */
interface SettingsDoc {
  /**
   * The ID of the user
   */
  id: string;
  /**
   * Configuration of the rank card
   */
  level: {
    /**
     * The Tag displayed
     */
    tag: string;
    /**
     * The color of the card (hex format)
     */
    color: string;
    /** 
     * The picture that will be displayed
     */
    picture: string;
  };
}
