const debug = require('debug')('verbose')

console.log('this is %s log message ✅', 'console')
console.warn('this is console %s ⚠️', 'warn')
console.error('this is console error 🔥')

// only visible when you call "DEBUG=verbose node ./index-debug"
debug('this is verbose debug = %d', 42)
