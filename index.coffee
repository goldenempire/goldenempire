argv = require('minimist')(process.argv.slice(2))

server = require('./lib/app.coffee')
  '/': require './router/index.coffee'

server.listen argv.port or 9615
