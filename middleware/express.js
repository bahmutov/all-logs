/**
 * Adds endpoint /__logs__ to Express server
 * that returns or resets all collected messages.
 */
module.exports = app => {
  if (!global.messages) {
    // there is no log collection
    return next()
  }

  const endpoint = '/__logs__'
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
