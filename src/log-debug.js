//
// intercepts and logs messages going through NPM module "debug"
// even the ones that are disabled right now
//

const util = require('util')
const path = require('path')
const stripAnsi = require('strip-ansi')

const formatDebugMessage = (...args) => stripAnsi(util.format(...args))

const logDebugCalls = messages => {
  // assume there is "debug" module, otherwise
  // do nothing (put try / catch around require)
  // we also need to make sure we are loading SAME debug module as the caller code
  // but make sure we can run from the "test" folder in this repo
  const debugPath = process.cwd().endsWith('/test')
    ? 'debug'
    : path.join(process.cwd(), 'node_modules', 'debug')
  const debug = require(debugPath)

  // All enabled debug instances by default use "debug.log" method
  // to actually write to process.stderr stream. Assume user code
  // does not change this, just save the message
  const debugLog = debug.log
  debug.log = (...args) => {
    messages.push({
      type: 'debug',
      message: formatDebugMessage(...args)
    })
    // and call the original method to print it
    debugLog.apply(debug, args)
  }

  // new instances are added using "debug.instances.push()"
  // so we can proxy this method
  debug.instances.push = debugInstance => {
    // for debugging missing logs
    // cnsl.log('pushing new debug instance %s', debugInstance.namespace)

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
    debugInstance.log = (...args) => {
      messages.push({
        type: 'debug',
        message: formatDebugMessage(...args)
      })
    }
  }
}

module.exports = logDebugCalls
