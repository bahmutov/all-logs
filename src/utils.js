/**
 * "debug" module for non-TTY output stream starts the message
 * with ISO timestamp like "2019-07-06T13:54:45.793Z"
 */
const timestampRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/g

/**
 * "debug" module for TTY output streams ends messages with
 * millisecond difference from the previous message like
 * "namespace my message +12ms"
 */
const msRegex = /\+\d+ms$/

module.exports = {
  timestampRegex,
  msRegex,
}
