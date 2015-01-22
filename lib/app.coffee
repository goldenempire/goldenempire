express    = require 'express'
bodyParser = require 'body-parser'

module.exports = (routes)->
  app = express()
  app.use bodyParser.json()
  app.use bodyParser.urlencoded extended: true

  for k,v of routes
    app.use k, v

  # process static before error
  app.use express.static './public'

  # catch 404 and forward to error handler
  app.use (req, res, next) ->
    err = new Error "Page #{req.url} not Found"
    err.status = 404
    next err

  # error handler
  app.use (err, req, res, next) ->
    #console.log err.stack or err
    res.status err.status or 500
    res.send
      message: err.message,
      status: err.status or 500
      stack: err.stack

  return app
