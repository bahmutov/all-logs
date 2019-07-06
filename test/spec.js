const snapshot = require('snap-shot-it')
const execa = require('execa-wrap')
const R = require('ramda')

/**
 * Common options for all tests.
 * Run in this test folder, and capture only some output fields
 */
const execaOptions = {
  cwd: __dirname,
  filter: ['code', 'stdout', 'stderr'],
  env: {
    PRINT_MESSAGES: '1'
  }
}
context('console logs', () => {
  it('has server output', () => {
    return execa('node', ['./server'], execaOptions).then(result => {
      snapshot('plain console logs', result)
    })
  })

  it('records console logs', () => {
    return execa('node', ['--require', '..', './server.js'], execaOptions).then(
      result => {
        snapshot('captured logs', result)
      }
    )
  })
})

context('debug logs', () => {
  const timestampRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/g
  const defaultTimestamp = '2019-07-06T13:54:45.793Z'

  it('collects enabled logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'verbose'
      }
    })

    snapshot('merged options', R.assoc('cwd', 'path/to/test/folder', options))

    return execa('node', ['./server-with-debug'], options).then(result => {
      // replace timestamps produced by "debug" module
      const noTimestampts = R.replace(timestampRegex, defaultTimestamp, result)
      snapshot('enabled debug logs', noTimestampts)
    })
  })
})
