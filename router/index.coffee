Q      = require 'q'
fs     = require 'fs'
router = require('express').Router()

RQ = require './../lib/rq.coffee'

router.get '/', (req, res)->
  console.log req.url
  RQ
    url: 'http://jhekson65.wix.com/goldenempire2'
  .then (body)->
    #res.send body.replace 'http://jhekson65.wix.com', ''
    #fs.writeFileSync '1.html', body
    res.send body

#router.get '*', (req, res)->
#  console.log req.url

module.exports = router