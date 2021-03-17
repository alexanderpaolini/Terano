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
