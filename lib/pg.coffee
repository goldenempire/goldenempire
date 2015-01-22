Q = require 'q'
pg = require 'pg'

class PG
  pgConnStr: ''

  pgConnect: () ->
    Q
    .nbind(pg.connect, pg)(@pgConnStr)

  constructor: (@pgConnStr, @readOnly = true) ->

  query: (query, placeHolders = [], fieldsToJson = []) ->
    # console.log 'PG', arguments
    if @readOnly and /\s(update|insert)\s/i.test query
      return Q.fcall ->
        throw new Error 'You have read only postgres connection rights'

    pgDone = null
    pgQuery = null
    pgClient = null
    @pgConnect()
    .then (connected) ->
      [ pgClient, pgDone ] = connected
      pgQuery = Q.nbind(pgClient.query, pgClient)
      pgQuery query, placeHolders
    .then (result) ->
      if fieldsToJson and !Array.isArray fieldsToJson
        fieldsToJson = [ fieldsToJson ]
      if fieldsToJson.length
        for r in result.rows
          for field in fieldsToJson
            if r.hasOwnProperty field
              r[field] = JSON.parse r[field]
      result
    .fin ->
      pgDone()

  end: ->
    pg.end()

  exists: (schema, table) ->
    @query "SELECT EXISTS(
        SELECT 1
        FROM   pg_catalog.pg_class c
        JOIN   pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE  n.nspname = '#{schema}'
        AND    c.relname = '#{table}'
      ) as t_exist;"
    .then (result) ->
      result.rows[0].t_exist

  transaction: () ->
    pgClient = null
    pgDone = null
    pgQuery = null

    begin: =>
      @pgConnect()
      .then (connected) ->
        [pgClient, pgDone] = connected
        pgQuery = Q.nbind(pgClient.query, pgClient)
        pgQuery 'BEGIN;'
    query: (sql, placeHolders = []) ->
      Q.fcall ->
        if @readOnly and /\s(update|insert)\s/i.test sql
          throw new Error 'You have read only postgres connection rights'
      .then ->
        pgQuery sql, placeHolders
    commit: ->
      pgQuery 'COMMIT;'
      .fin ->
        pgDone()
    rollback: ->
      pgQuery 'ROLLBACK;'
      .fin ->
        pgDone()

module.exports = PG