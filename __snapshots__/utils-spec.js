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

exports['utils utcTimestampRegex detects utc timestamp strings 1'] = {
  "Sat, 20 Jul 2019 19:08:47 GMT compute 2 + 3 = 5": true,
  "2019-07-19T02:03:45.827Z compute 5 + 10 = 15": false,
  "2019-02-01 some other format": false
}
