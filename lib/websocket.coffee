# start Primus
http    = require 'http'
Primus  = require 'primus'

module.exports = (app)->
  server  = http.createServer app
  primus  = new Primus server,
    #transformer: 'websockets'
    transformer: 'engine.io'
    parser: 'JSON'

  # generate client library
  #primus.save __dirname+'/public/scripts/primus.js'

  # got incoming connection from browser
  primus.on 'connection', (spark) ->
    #  ex = {}
    #  clear_intervals = ->
    #    for k,v of ex
    #      clearInterval ex[k].interval
    #
    #  exchanges.forEach (api)->
    #    ex[api.name] ?= {}
    #    ex[api.name].interval = setInterval(->
    #      api.get_price_usd()
    #      .then (rs)->
    #        if rs.timestamp != ex[api.name].timestamp
    #          ex[api.name].timestamp = rs.timestamp
    #          date = (new Date(rs.timestamp)).toFormat 'HH24:MI:SS'
    #          spark.send 'ticker', api.name, rs, date
    #        else
    #          console.log 'skipping'
    #      .catch console.log
    #    , 500)

    spark.on 'disconnection', ->
      console.log 'socket disconnection'
      #clear_intervals()

    spark.on 'end', ->
      console.log 'socket end'
      #clear_intervals()

  # run server
  # WARN! but not app.listen 3000
  return server