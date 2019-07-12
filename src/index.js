/// <reference path="./index.d.ts" />
// @ts-check
const util = require('util')

// ignore "console.table" and "console.dir" for now
const methodNames = ['log', 'warn', 'error']

/**
 * put all messages interleaved into single list
 * so we can see how they all appeared
 * each message should have "type", "namespace" and "message"
 *
 * @type Message[]
 */
const messages = []

// @ts-ignore
global.messages = messages

/**
 * put the original log methods into a global object
 * so we can do two things:
 *  1: restore the methods when needed
 *  2: print messages without going through proxied methods
 *      like "cnsl.log('my message')"
 */
const cnsl = {}
// @ts-ignore
global.cnsl = cnsl

methodNames.forEach(methodName => {
  const originalMethod = (cnsl[methodName] = console[methodName])

  console[methodName] = (...args) => {
    // save the original message (formatted into a single string)
    // use "util.format" to perform string formatting if needed
    const params = Array.prototype.slice.call(args, 1)
    const message = params.length ? util.format(args[0], ...params) : args[0]

    messages.push({
      type: 'console',
      namespace: methodName, // "log", "warn", "error"
      message,
      timestamp: new Date().toISOString(),
    })

    // call the original method like "console.log"
    originalMethod.apply(console, args)
  }
})

// intercept "debug" module logging calls
require('./log-debug')(messages)
// intercept all "util.debuglog" messages
require('./log-util-debug')(messages)

/**
 * A method to restore the original console methods
 */
const restore = () => {
  Object.keys(cnsl).forEach(methodName => {
    console[methodName] = cnsl[methodName]
  })
}
// add a method to "console" to restore the original non-proxied methods
// @ts-ignore
console.restore = restore

// for unit testing
if (process.env.PRINT_MESSAGES) {
  process.on('beforeExit', () => {
    restore()

    console.log('*** printing saved messages ***')
    messages.forEach(m => {
      console.log('%s: %s| %s', m.type, m.namespace, m.message)
    })
  })
}
