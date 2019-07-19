exports['captured debug logs'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  *** printing saved messages ***
  console: log| this is console log message ✅
  console: warn| this is console warn ⚠️
  console: error| this is console error 🔥
  debug: verbose| this is verbose debug = 42
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  2019-07-06T13:54:45.793Z verbose this is verbose debug = 42
  -------

`

exports['captured logs'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  *** printing saved messages ***
  console: log| this is console log message ✅
  console: warn| this is console warn ⚠️
  console: error| this is console error 🔥
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  -------

`

exports['captured util.debuglog'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  *** printing saved messages ***
  console: log| this is console log message ✅
  console: warn| this is console warn ⚠️
  console: error| this is console error 🔥
  util.debuglog: VERBOSE| this is verbose debug = 42
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  VERBOSE 999: this is verbose debug = 42
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

exports['enabled util.debuglog'] = `
  code: 0
  stdout:
  -------
  this is console log message ✅
  -------
  stderr:
  -------
  this is console warn ⚠️
  this is console error 🔥
  VERBOSE 999: this is verbose debug = 42
  -------

`

exports['merged NODE_DEBUG options'] = {
  "cwd": "path/to/test/folder",
  "filter": [
    "code",
    "stdout",
    "stderr"
  ],
  "env": {
    "PRINT_MESSAGES": "1",
    "NODE_DEBUG": "verbose"
  }
}

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

exports['utils removeNamespaceAndPid keeps original message if colon cannot be found 1'] = {
  "text": "this is normal message",
  "result": "this is normal message"
}

exports['utils removeNamespaceAndPid removes namespace and pid 1'] = {
  "text": "VERBOSE 177: this is verbose debug = 42",
  "result": "this is verbose debug = 42"
}

exports['utils timestampRegex detects timestamp 1'] = {
  "2019-07-19T02:03:45.729Z compute 2 + 3 = 5": true,
  "2019-07-19T02:03:45.827Z compute 5 + 10 = 15": true,
  "2019-02-01 some other format": false
}
