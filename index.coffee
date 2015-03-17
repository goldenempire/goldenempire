server = require('./lib/app.coffee')
  '/': require './router/index.coffee'

server.listen process.env.PORT or 9615
