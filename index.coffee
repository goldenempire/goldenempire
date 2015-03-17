server = require('./lib/app.coffee')
  '/': require './router/index.coffee'

console.log process.env.PORT or 9615
server.listen process.env.PORT or 9615
