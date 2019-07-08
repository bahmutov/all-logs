// starting with Node 0.11.3
// https://nodejs.org/api/util.html#util_util_debuglog_section
const debug = require('util').debuglog('verbose')

console.log('this is %s log message ✅', 'console')
console.warn('this is console %s ⚠️', 'warn')
console.error('this is console error 🔥')

// only visible when you call "NODE_DEBUG=verbose node ./test/server-with-util-debug"
debug('this is verbose debug = %d', 42)
