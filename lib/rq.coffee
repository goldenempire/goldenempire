Q = require 'q'
request = require 'request'

module.exports = (options) ->
# !!! WARNING:
# deferred = Q.defer() -- not working in iced_coffee: ReferenceError: __iced_deferrals is not defined
  #console.log options
  simpleReq = (opts, cb) ->
    request opts, (err, res, body) ->
      #console.log body or err
      if err
        cb err
      else
        if 200!=res.statusCode
          if body
            cb body
          else
            cb new Error "Bad response #{res.statusCode} from gate.email"
        else
          cb null, body
  Q.denodeify(simpleReq)(options)
