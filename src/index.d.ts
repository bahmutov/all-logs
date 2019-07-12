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
}

declare global {
  interface Global {
    messages: string[]
  }
}
