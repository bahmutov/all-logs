const snapshot = require('snap-shot-it')
const execa = require('execa-wrap')
const R = require('ramda')
const utils = require('../src/utils')

/**
 * Common options for all tests.
 * Run in this test folder, and capture only some output fields
 */
const execaOptions = {
  cwd: __dirname,
  filter: ['code', 'stdout', 'stderr'],
  env: {
    PRINT_MESSAGES: '1',
  },
}
context('console logs', () => {
  it('has server output', () => {
    return execa(
      'node',
      ['--require', './print-on-exit', './server'],
      execaOptions,
    ).then(result => {
      snapshot('plain console logs', result)
    })
  })

  it('records console logs', () => {
    return execa(
      'node',
      ['--require', '..', '--require', './print-on-exit', './server.js'],
      execaOptions,
    ).then(result => {
      snapshot('captured logs', result)
    })
  })
})

context('debug logs', () => {
  const defaultTimestamp = '2019-07-06T13:54:45.793Z'

  it('prints debug logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'verbose',
      },
    })

    snapshot('merged options', R.assoc('cwd', 'path/to/test/folder', options))

    return execa(
      'node',
      ['--require', './print-on-exit', './server-with-debug'],
      options,
    ).then(result => {
      // replace timestamps produced by "debug" module
      const noTimestampts = R.replace(
        utils.timestampRegex,
        defaultTimestamp,
        result,
      )
      snapshot('enabled debug logs', noTimestampts)
    })
  })

  it('collects enabled logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'verbose',
      },
    })

    return execa(
      'node',
      [
        '--require',
        '..',
        '--require',
        './print-on-exit',
        './server-with-debug',
      ],
      options,
    ).then(result => {
      const noTimestampts = R.replace(
        utils.timestampRegex,
        defaultTimestamp,
        result,
      )
      snapshot('captured debug logs', noTimestampts)
    })
  })
})

context('util.debuglog', () => {
  // replace dynamic process id with same value
  const pidRegex = /\d+: /g
  const defaultPid = '999: '

  it('prints NODE_DEBUG logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        NODE_DEBUG: 'verbose',
      },
    })

    snapshot(
      'merged NODE_DEBUG options',
      R.assoc('cwd', 'path/to/test/folder', options),
    )

    return execa(
      'node',
      ['--require', './print-on-exit', './server-with-util-debug'],
      options,
    ).then(result => {
      // replace PID values printed by "util.debuglog" calls
      const noTimestampts = R.replace(pidRegex, defaultPid, result)
      snapshot('enabled util.debuglog', noTimestampts)
    })
  })

  it('collects all logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        NODE_DEBUG: 'verbose',
      },
    })

    return execa(
      'node',
      [
        '--require',
        '..',
        '--require',
        './print-on-exit',
        './server-with-util-debug',
      ],
      options,
    ).then(result => {
      const noTimestampts = R.replace(pidRegex, defaultPid, result)
      snapshot('captured util.debuglog', noTimestampts)
    })
  })
})
