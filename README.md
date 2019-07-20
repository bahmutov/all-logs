# @bahmutov/all-logs [![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/all-logs.svg?style=svg)](https://circleci.com/gh/bahmutov/all-logs)

## Goal

This module captures:

- `console.{log, warn, error}` messages
- all messages via [debug](https://github.com/visionmedia/debug) module
- all messages via [util.debuglog](https://nodejs.org/api/util.html#util_util_debuglog_section)

## Use

```
npm install --save @bahmutov/all-logs
```

Then load this module before your CLI / server code. I suggest just requiring it before your normal module. For example, if normally you start your server like:

```json
{
  "scripts": {
    "start": "node ./lib/server.js"
  }
}
```

Then you change it to simply be:

```json
{
  "scripts": {
    "start": "node -r @bahmutov/all-logs ./lib/server.js"
  }
}
```

### Note: when `debug` module is used in dependencies

This module tries to discover `debug` module in the current module's dependencies, and in all its immediate production dependencies. If it is possible to proxy (older versions of `debug` module are not compatible), then their logs will be intercepted and you will see `debug` logs from both your application and its immediate dependencies.

### Message format

Each message object has type, namespace and the message text. It also contains a timestamp as ISO string. See [src/index.d.ts](src/index.d.ts) for the exact interface definition.

### Middleware

To expose captured log messages, use the included middleware

- for Express servers use [middleware/express.js](middleware/express.js)

```js
if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}
```

- for plain Node `http` server use [middleware/http.js](middleware/http.js)

```js
const http = require('http')
const logs = require('@bahmutov/all-logs/middleware/http')
http.createServer((req, res) => {
  if (logs(req, res) === true) {
    return
  }
  // your normal handler
})
```

Which adds `GET|POST /__messages__` endpoint

## See more

- Read ["Capture all the logs"](https://glebbahmutov.com/blog/capture-all-the-logs/)
- This module can be used very well with [@bahmutov/cy-api](https://github.com/bahmutov/cy-api) command for Cypress end-to-end API testing

## Development

### Renovate

We are using RenovateBot to keep dependencies up to date. Find the settings in [renovate.json](renovate.json) file. Note that we ignore module `debug` since we are testing this module with older versions in subfolders.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2019

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/all-logs/issues) on Github

## MIT License

Copyright (c) 2019 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
