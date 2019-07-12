/**
 * Alias for readability to ISO timestamp string.
 * @example new Date().toISOString() // "2019-07-12T03:26:09.809Z"
 */
type isoTimeStamp = string

/**
 * A message object with text and meta information.
 */
interface Message {
  /**
   * The type of the message: console, debug, util.debuglog
   */
  type: 'console' | 'debug' | 'util.debuglog'
  /**
   * User selected namespace. For "console" type it will be
   * "log", "warn", "error"
   */
  namespace: string
  /**
   * The actual text
   */
  message: string
  /**
   * Message timestamp, ISO string like "2019-07-12T03:26:09.809Z"
   */
  timestamp: isoTimeStamp
}

declare global {
  interface Global {
    messages: string[]
  }
}
