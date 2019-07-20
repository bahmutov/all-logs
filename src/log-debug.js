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
const fs = require('fs')

const findDebugForProdDependencies = () => {
  if (!fs.existsSync('./package.json')) {
    // not running from actual user process
    return []
  }
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  const productionDependencies = pkg.dependencies || []
  // console.log('pkg has prod dependencies %o', productionDependencies)

  const debugPaths = Object.keys(productionDependencies)
    .map(name => {
      const potentialDebugPackage = path.join(
        process.cwd(),
        'node_modules',
        name,
        'node_modules',
        'debug',
      )
      if (fs.existsSync(potentialDebugPackage)) {
        // console.log(
        //   'dep %s has its own debug module in %s',
        //   name,
        //   potentialDebugPackage
        // )
        return potentialDebugPackage
      }
    })
    .filter(Boolean)

  return debugPaths
}

// @ts-ignore
const toText = (...args) => stripAnsi(util.format(...args))
// TODO unit test this function
const formatDebugMessage = (namespace, ...args) => {
  let text = toText(...args).trim()

  // removes namespace or timestamp plus namespace
  // from each debug log message
  const namespaceIndex = text.indexOf(namespace)
  if (namespaceIndex !== -1) {
    text = text.substr(namespaceIndex + namespace.length + 1)
  }

  const msMatches = text.match(utils.msRegex)
  if (msMatches) {
    // text + milliseconds
    // remove the milliseconds part
    text = text.substr(0, msMatches.index)
  }

  return text
}

const enableLogMethod = messages => debugInstance => {
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

const proxyDebugV2 = (messages, createDebug) => {
  createDebug.init = enableLogMethod(messages)
}

/**
 * Sets up a hook to catch ALL created debug instances.
 * Works with "debug" v3+
 */
const proxyDebugV3 = (messages, debug) => {
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

/**
 * List of already proxied debug modules to avoid
 * double proxy
 */
const proxiedDebugPaths = {}

const proxyDebugModule = (messages, debugPath) => {
  // global.cnsl.log('proxy debug module at', debugPath)
  try {
    const resolvedPath = require.resolve(debugPath)
    // global.cnsl.log('resolved path %s', resolvedPath)
    if (proxiedDebugPaths[resolvedPath]) {
      return
    }
    proxiedDebugPaths[resolvedPath] = true
  } catch (e) {
    // could not load debug module for some reason,
    // move on
    return
  }

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

  // global.cnsl.log('debug object is', debug)
  // global.cnsl.log('debug.enabled is', debug.enabled)

  if (Array.isArray(debug.instances)) {
    // new instances are added using "debug.instances.push()"
    // so we can proxy this method
    return proxyDebugV3(messages, debug)
  } else {
    return proxyDebugV2(messages, debug)
  }
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

  proxyDebugModule(messages, debugPath)

  // additionally
  const debugPaths = findDebugForProdDependencies()
  debugPaths.forEach(debugPath => {
    try {
      proxyDebugModule(messages, debugPath)
    } catch (e) {
      // different debug module versions might not work with our current proxy methods
      // @ts-ignore
      global.cnsl.warn('⚠️ could not proxy debug module', debugPath)
    }
  })
}

module.exports = logDebugCalls
