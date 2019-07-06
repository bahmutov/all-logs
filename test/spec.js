const snapshot = require('snap-shot-it')
const execa = require('execa-wrap')

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
