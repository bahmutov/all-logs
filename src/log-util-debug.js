//
// intercepts and saves messages that use "util.debuglog"
// to print verbose namespaced messages
// see https://nodejs.org/api/util.html#util_util_debuglog_section
//

/// <reference path="./index.d.ts" />
// @ts-check

const util = require('util')

const originalDebuglog = util.debuglog

// @ts-ignore
const formatUtilDebugMessage = (...args) => util.format(...args)

/**
 * Given a string like "VERBOSE 39127: this is verbose debug = 42"
 * removes everything including the first ":"
 * @param {string} s - the text message
 */
const removeNamespaceAndPid = s => {
  const colon = s.indexOf(': ')
  return s.substr(colon + 2)
}

/**
 * Sets up proxying of log calls to "util.debuglog" methods.
 * Proxied messages will be added to the list passed by reference.
 *
 * @param {Message[]} messages Array of messages to add to
 */
function logUtilDebugCalls(messages) {
  //
  // copied NODE_ENV namespace regular expression logic from
  // https://github.com/nodejs/node/blob/af6d26281f734dbbf1bf497103d1cb4b85a52b2e/lib/util.js#L191
  //
  let debugEnvRegex = /^$/
  if (process.env.NODE_DEBUG) {
    let debugEnv = process.env.NODE_DEBUG
    debugEnv = debugEnv
      .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/,/g, '$|^')
      .toUpperCase()
    debugEnvRegex = new RegExp(`^${debugEnv}$`, 'i')
  }

  util.debuglog = function(namespace) {
    const name = namespace.toUpperCase()
    const log = originalDebuglog(namespace)

    return function proxyLog(...args) {
      // possibly logged to "console.error" if the namespace is enabled
      const debugLogResult = log(...args)

      if (debugEnvRegex.test(name)) {
        // the namespace has been enabled, and we JUST logged
        // a wrong "console.error" message
        const lastMessage = messages[messages.length - 1]
        lastMessage.type = 'util.debuglog'
        lastMessage.namespace = name
        lastMessage.message = removeNamespaceAndPid(lastMessage.message)
      } else {
        // no, the namespace has not been enabled
        // so we need to grab this message
        messages.push({
          type: 'util.debuglog',
          namespace: name,
          message: formatUtilDebugMessage(...args),
          timestamp: new Date().toISOString(),
        })
      }

      return debugLogResult
    }
  }
}

module.exports = logUtilDebugCalls
