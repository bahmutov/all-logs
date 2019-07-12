//
// intercepts and logs messages going through NPM module "debug"
// even the ones that are disabled right now
//

/// <reference path="./index.d.ts" />
// @ts-check

const util = require('util')
const path = require('path')
const stripAnsi = require('strip-ansi')
const utils = require('./utils')

// @ts-ignore
const toText = (...args) => stripAnsi(util.format(...args))
// TODO unit test this function
const formatDebugMessage = (namespace, ...args) => {
  let text = toText(...args).trim()
  if (utils.timestampRegex.test(text)) {
    // the message has timestamp + namespace + actual text
    // remove timestamp and namespace
    // timestamp has 24 characters plus space = 25
    text = text.substr(25 + namespace.length + 1)
  } else {
    // the message has namespace + actual text + milliseconds
    text = text.substr(namespace.length + 1)
  }

  const msMatches = text.match(utils.msRegex)
  if (msMatches) {
    // text + milliseconds
    // remove the milliseconds part
    text = text.substr(0, msMatches.index)
  }

  return text
}

/**
 * Sets up proxying of log calls to "debug" module.
 * Proxied messages will be added to the list passed by reference.
 *
 * @param {Message[]} messages Array of messages to add to
 */
const logDebugCalls = messages => {
  // assume there is "debug" module, otherwise
  // do nothing (put try / catch around require)
  // we also need to make sure we are loading SAME debug module as the caller code
  // but make sure we can run from the "test" folder in this repo
  const debugPath = process.cwd().endsWith('/test')
    ? 'debug'
    : path.join(process.cwd(), 'node_modules', 'debug')
  const debug = require(debugPath)

  // original "debug.log" method
  const debugLog = debug.log
  // All enabled debug instances by default use "debug.log" method
  // to actually write to process.stderr stream. Assume the user code
  // does not change this, just save the message.
  debug.log = function(...args) {
    messages.push({
      type: 'debug',
      namespace: this.namespace,
      message: formatDebugMessage(this.namespace, ...args),
      timestamp: new Date().toISOString(),
    })
    // and call the original method to print it
    debugLog.apply(debug, args)
  }

  // new instances are added using "debug.instances.push()"
  // so we can proxy this method
  debug.instances.push = debugInstance => {
    // for debugging missing logs
    // cnsl.log('pushing new debug instance with namespace "%s"', namespace)

    Array.prototype.push.call(debug.instances, debugInstance)

    if (debugInstance.enabled) {
      // ignore custom debugInstance.log method - we could
      // intercept that as well by using "setter" property
      return
    }

    // if the debug instance is disabled, the common "debug.log"
    // method is NOT going to be called. We DO want to record the message though
    // to enable test debugging
    debugInstance.enabled = true
    debugInstance.useColors = false

    debugInstance.log = (...args) => {
      messages.push({
        type: 'debug',
        namespace: debugInstance.namespace,
        message: formatDebugMessage(debugInstance.namespace, ...args),
        timestamp: new Date().toISOString(),
      })
    }
  }
}

module.exports = logDebugCalls
