//
// intercepts and saves messages that use "util.debuglog"
// to print verbose namespaced messages
// see https://nodejs.org/api/util.html#util_util_debuglog_section
//

const util = require('util')

const originalDebuglog = util.debuglog

const formatUtilDebugMessage = (...args) => util.format(...args)

function logUtilDebugCalls(messages) {
  util.debuglog = function(namespace) {
    const name = namespace.toUpperCase()
    const pid = process.pid
    const prefix = name + ' ' + pid + ': '
    const log = originalDebuglog(namespace)

    return function proxyLog(...args) {
      messages.push({
        type: 'util.debuglog',
        message: prefix + formatUtilDebugMessage(...args),
      })

      return log(...args)
    }
  }
}

module.exports = logUtilDebugCalls
