const util = require('util')

function logDebugCalls (messages) {
  // assume there is "debug" module, otherwise
  // do nothing (put try / catch around require)
  const debug = require('debug')

  // All enabled debug instances by default use "debug.log" method
  // to actually write to process.stderr stream. Assume user code
  // does not change this, just save the message
  const debugLog = debug.log
  debug.log = (...args) => {
    messages.push({
      type: 'debug',
      message: util.format(...args)
    })
    // and call the original method to print it
    debugLog.apply(debug, args)
  }

  // new instances are added using "debug.instances.push()"
  // so we can proxy this method
  debug.instances.push = debugInstance => {
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
        message: util.format(...args)
      })
    }
  }
}

module.exports = logDebugCalls
