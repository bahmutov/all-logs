/* eslint-env mocha */

const snapshot = require('snap-shot-it')
const execa = require('execa-wrap')
const R = require('ramda')
const utils = require('../src/utils')

require('mocha-banner').register()

/**
 * Common options for all tests.
 * Run in this test folder, and capture only some output fields
 */
const execaOptions = {
  cwd: __dirname,
  filter: ['code', 'stdout', 'stderr'],
}

describe('debug@2', () => {
  // timestamp in the form "new Date().toUTCString()"
  const defaultTimestamp = 'Sat, 20 Jul 2019 12:34:56 GMT'

  it('does not print debug logs when disabled', () => {
    const options = R.mergeDeepRight(execaOptions, {
      // runs execa with empty environment variables
      env: {},
      extendEnv: false,
    })

    return execa('node', ['.'], options).then(result => {
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.utcTimestampString, 'g'),
        defaultTimestamp,
        result,
      )
      // there should not be stderr - because "debug" module was not enabled
      snapshot(replacedTimestampts)
    })
  })

  it('prints enabled debug logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'debug-v2',
        DEBUG_COLORS: 'no', // force printing UTC timestamp
      },
    })

    return execa('node', ['.'], options).then(result => {
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.utcTimestampString, 'g'),
        defaultTimestamp,
        result,
      )
      snapshot(replacedTimestampts)
    })
  })

  it('collects enabled debug logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'debug-v2',
      },
    })

    return execa(
      'node',
      ['--require', '..', '--require', '../test/print-on-exit', '.'],
      options,
    ).then(result => {
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.utcTimestampString, 'g'),
        defaultTimestamp,
        result,
      )
      snapshot(replacedTimestampts)
    })
  })

  it('collects even disabled debug logs', () => {
    // run execa with empty environment variables
    // to disable debug module logs
    const options = R.mergeDeepRight(execaOptions, {
      env: {},
      extendEnv: false,
    })

    return execa(
      'node',
      ['--require', '..', '--require', '../test/print-on-exit', '.'],
      options,
    ).then(result => {
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.utcTimestampString, 'g'),
        defaultTimestamp,
        result,
      )
      snapshot(replacedTimestampts)
    })
  })
})
