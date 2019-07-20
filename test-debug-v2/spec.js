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
  const defaultTimestamp = '2019-07-06T13:54:45.793Z'

  it.only('prints enabled debug logs', () => {
    const options = R.mergeDeepRight(execaOptions, {
      env: {
        DEBUG: 'debug-v2',
        DEBUG_COLORS: 'no', // force printing UTC timestamp
      },
    })

    return execa('node', ['.'], options).then(result => {
      console.log(result)
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.timestampExpression, 'g'),
        defaultTimestamp,
        result,
      )
      // snapshot('enabled debug logs', replacedTimestampts)
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
      ['--require', '../test/print-on-exit', '.'],
      options,
    ).then(result => {
      console.log(result)
      // replace timestamps produced by "debug" module
      const replacedTimestampts = R.replace(
        new RegExp(utils.timestampExpression, 'g'),
        defaultTimestamp,
        result,
      )
      // snapshot('enabled debug logs', replacedTimestampts)
    })
  })

  // it('collects enabled logs', () => {
  //   const options = R.mergeDeepRight(execaOptions, {
  //     env: {
  //       DEBUG: 'verbose'
  //     }
  //   })

  //   return execa(
  //     'node',
  //     [
  //       '--require',
  //       '..',
  //       '--require',
  //       './print-on-exit',
  //       './server-with-debug'
  //     ],
  //     options
  //   ).then(result => {
  //     const noTimestampts = R.replace(
  //       utils.timestampRegex,
  //       defaultTimestamp,
  //       result
  //     )
  //     snapshot('captured debug logs', noTimestampts)
  //   })
  // })
})
