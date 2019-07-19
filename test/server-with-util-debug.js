// starting with Node 0.11.3
// https://nodejs.org/api/util.html#util_util_debuglog_section
const debug = require('util').debuglog('verbose')

console.log('this is %s log message ✅', 'console')
console.warn('this is console %s ⚠️', 'warn')
console.error('this is console error 🔥')

// only visible when you call "NODE_DEBUG=verbose node ./test/server-with-util-debug"
debug('this is verbose debug = %d', 42)

// prints uppercase namespace + process id like this
// VERBOSE 96315: this is verbose debug = 42

// to print all captured messages run this program with
// NODE_DEBUG=verbose node -r . -r ./test/print-on-exit.js ./test/server-with-util-debug
