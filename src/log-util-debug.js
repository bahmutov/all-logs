//
// intercepts and saves messages that use "util.debuglog"
// to print verbose namespaced messages
// see https://nodejs.org/api/util.html#util_util_debuglog_section
//

/// <reference path="./index.d.ts" />
// @ts-check

const util = require('util')
const { removeNamespaceAndPid } = require('./utils')

const originalDebuglog = util.debuglog

// @ts-ignore
const formatUtilDebugMessage = (...args) => util.format(...args)

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

      const isLastMessageFromUtilLog = () => {
        if (!messages.length) {
          return false
        }
        const lastMessage = messages[messages.length - 1]
        if (lastMessage.type !== 'console') {
          return false
        }
        if (lastMessage.namespace !== 'error') {
          return false
        }
        if (lastMessage.message.indexOf(name) !== 0) {
          return false
        }
        return true
      }

      if (debugEnvRegex.test(name) && isLastMessageFromUtilLog()) {
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
