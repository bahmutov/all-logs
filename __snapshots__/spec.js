exports['captured logs'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  *** printing saved messages ***
  log: this is console log message ✅
  warn: this is console warn ⚠️
  error: this is console error 🔥
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  -------

`

exports['plain console logs'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  -------

`
