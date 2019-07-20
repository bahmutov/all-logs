exports['debug@2 prints enabled debug logs 1'] = `
  code: 0
  stdout:
  -------
  making debug-v2 namespace call 1 = 1
  -------
  stderr:
  -------
  Sat, 20 Jul 2019 19:10:43 GMT debug-v2 this debug call should print 1 = 1
  -------

`

exports['debug@2 does not print debug logs when disabled 1'] = `
  code: 0
  stdout:
  -------
  making debug-v2 namespace call 1 = 1
  -------
  stderr:
  -------
  
  -------

`
