server = require('./lib/app.coffee')
  '/': require './router/index.coffee'

server.listen 3000
