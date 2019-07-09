/**
 * Adds an endpoint to plain HTTP Node server
 * that returns or resets all collected messages.
 *
 * Returns true if the request was handled.
 */
module.exports = (req, res) => {
  if (!global.messages) {
    // there is no log collection
    return
  }

  const endpoint = '/__messages__'

  if (req.url === endpoint) {
    if (req.method === 'POST') {
      global.messages.length = 0
      res.writeHead(200)
      res.end()
      return true
    } else if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          messages: global.messages
        })
      )
      return true
    } else {
      res.status(500).send(`Not sure what to do for ${req.method} ${req.url}`)
      return true
    }
  }
}
