const snapshot = require('snap-shot-it')
const execa = require('execa-wrap')

it('has server output', () => {
  return execa('node', ['./server'], {
    cwd: __dirname,
    filter: ['code', 'stdout', 'stderr']
  }).then(result => {
    snapshot('plain console logs', result)
  })
})
it.skip('records console logs', () => {
  return execa('node -r ')
})
