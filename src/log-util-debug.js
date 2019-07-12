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
 * Sets up proxying of log calls to "util.debuglog" methods.
 * Proxied messages will be added to the list passed by reference.
 *
 * @param {Message[]} messages Array of messages to add to
 */
function logUtilDebugCalls(messages) {
  util.debuglog = function(namespace) {
    const name = namespace.toUpperCase()
    const log = originalDebuglog(namespace)

    return function proxyLog(...args) {
      messages.push({
        type: 'util.debuglog',
        namespace: name,
        message: formatUtilDebugMessage(...args),
      })

      return log(...args)
    }
  }
}

module.exports = logUtilDebugCalls
