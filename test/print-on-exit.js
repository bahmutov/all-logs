// useful for unit testing, prints collected messages on process exit
if (process.env.PRINT_MESSAGES && console.restore) {
  process.on('beforeExit', () => {
    console.restore()

    console.log('*** printing saved messages ***')
    messages.forEach(m => {
      console.log('%s: %s| %s', m.type, m.namespace, m.message)
    })
  })
}
