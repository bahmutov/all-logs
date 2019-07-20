const R = require('ramda')
const snapshot = require('snap-shot-it')

const utils = require('../src/utils')

require('mocha-banner').register()

describe('utils', () => {
  context('timestampRegex', () => {
    it('detects timestamp', () => {
      const strings = [
        '2019-07-19T02:03:45.729Z compute 2 + 3 = 5',
        '2019-07-19T02:03:45.827Z compute 5 + 10 = 15',
        '2019-02-01 some other format',
      ]
      const detected = strings.map(s => utils.timestampRegex.test(s))
      snapshot(R.zipObj(strings, detected))
    })
  })

  context('utcTimestampRegex', () => {
    it('detects utc timestamp strings', () => {
      const strings = [
        'Sat, 20 Jul 2019 19:08:47 GMT compute 2 + 3 = 5',
        '2019-07-19T02:03:45.827Z compute 5 + 10 = 15',
        '2019-02-01 some other format',
      ]
      const detected = strings.map(s => utils.utcTimestampRegex.test(s))
      snapshot(R.zipObj(strings, detected))
    })
  })

  context('removeNamespaceAndPid', () => {
    it('removes namespace and pid', () => {
      const text = 'VERBOSE 177: this is verbose debug = 42'
      const result = utils.removeNamespaceAndPid(text)
      snapshot({
        text,
        result,
      })
    })

    it('keeps original message if colon cannot be found', () => {
      const text = 'this is normal message'
      const result = utils.removeNamespaceAndPid(text)
      snapshot({
        text,
        result,
      })
    })
  })
})
