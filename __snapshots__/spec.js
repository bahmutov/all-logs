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

exports['enabled debug logs'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  2019-07-06T13:54:45.793Z verbose this is verbose debug = 42
  -------

`

exports['merged options'] = {
  "cwd": "path/to/test/folder",
  "filter": [
    "code",
    "stdout",
    "stderr"
  ],
  "env": {
    "PRINT_MESSAGES": "1",
    "DEBUG": "verbose"
  }
}

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
