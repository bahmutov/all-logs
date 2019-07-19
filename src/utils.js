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
  msRegex,
  removeNamespaceAndPid,
}
