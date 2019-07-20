exports['debug@2 prints enabled debug logs 1'] = `
  code: 0
  stdout:
  -------
  making debug-v2 namespace call 1 = 1
  -------
  stderr:
  -------
  Sat, 20 Jul 2019 12:34:56 GMT debug-v2 this debug call should print 1 = 1
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

exports['debug@2 collects enabled debug logs 1'] = `
  code: 0
  stdout:
  -------
  making debug-v2 namespace call 1 = 1
  *** printing saved messages ***
  console: log| making debug-v2 namespace call 1 = 1
  debug: debug-v2| this debug call should print 1 = 1
  -------
  stderr:
  -------
  Sat, 20 Jul 2019 12:34:56 GMT debug-v2 this debug call should print 1 = 1
  -------

`

exports['debug@2 collects even disabled debug logs 1'] = `
  code: 0
  stdout:
  -------
  making debug-v2 namespace call 1 = 1
  *** printing saved messages ***
  console: log| making debug-v2 namespace call 1 = 1
  debug: debug-v2| this debug call should print 1 = 1
  -------
  stderr:
  -------
  
  -------

`
