/**
 * Adds an endpoint to Express server
 * that returns or resets all collected messages.
 */
module.exports = app => {
  if (!global.messages) {
    // there is no log collection
    return
  }

  const endpoint = '/__messages__'
  app.get(endpoint, (req, res) => {
    res.json({
      messages: global.messages,
    })
  })

  app.post(endpoint, (req, res) => {
    global.messages.length = 0
    res.sendStatus(200)
  })
}
