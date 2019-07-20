/**
 * String for ISO timestamp detection. This string allows us to construct
 * regular expression whenever needed, either single use or for global replacement.
 */
const timestampExpression =
  '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)'

/**
 * "debug" module for non-TTY output stream starts the message
 * with ISO timestamp like "2019-07-06T13:54:45.793Z"
 */
const timestampRegex = new RegExp(timestampExpression)

/**
 * String for detecting "new Date().toUTCString()" like "Sat, 20 Jul 2019 18:56:12 GMT"
 */
const utcTimestampString =
  '(:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\\,\\s\\d{2}\\s(:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s\\d{4}\\s\\d{2}:\\d{2}:\\d{2}\\sGMT'

/**
 * "debug" module v2 for non-TTY output (or with "DEBUG_COLORS=no") prints
 * timestamps using "new Date().toUTCString()". This regular expression detects it.
 */
const utcTimestampRegex = new RegExp(utcTimestampString)

/**
 * "debug" module for TTY output streams ends messages with
 * millisecond difference from the previous message like
 * "namespace my message +12ms"
 */
const msRegex = /\+\d+ms$/

/**
 * Given a string like "VERBOSE 39127: this is verbose debug = 42"
 * removes everything including the first ":". If the colon cannot be found,
 * returns the original string
 * @param {string} s - the text message
 */
const removeNamespaceAndPid = s => {
  const colon = s.indexOf(': ')
  if (colon === -1) {
    return s
  }
  return s.substr(colon + 2)
}

module.exports = {
  timestampExpression,
  timestampRegex,
  utcTimestampString,
  utcTimestampRegex,
  msRegex,
  removeNamespaceAndPid,
}
