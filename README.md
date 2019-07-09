# @bahmutov/all-logs [![CircleCI](https://circleci.com/gh/bahmutov/all-logs.svg?style=svg)](https://circleci.com/gh/bahmutov/all-logs)

## Use

This module captures:

- `console.{log, warn, error}` messages
- all messages via [debug](https://github.com/visionmedia/debug) module
- all messages via [util.debuglog](https://nodejs.org/api/util.html#util_util_debuglog_section)

### Middleware

To expose captured log messages, use the included middleware

- for Express servers use [middleware/express.js](middleware/express.js)

```js
if (global.messages) {
  require('@bahmutov/all-logs/middleware/express')(app)
}
```

Which adds `GET|POST /__messages__` endpoint

## See more

- Read ["Capture all the logs"](https://glebbahmutov.com/blog/capture-all-the-logs/)

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
