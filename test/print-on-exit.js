// useful for unit testing, prints collected messages on process exit
if (global.messages && console.restore) {
  process.on('beforeExit', () => {
    console.restore()

    console.log('*** printing saved messages ***')
    global.messages.forEach(m => {
      console.log('%s: %s| %s', m.type, m.namespace, m.message)
    })
  })
}
