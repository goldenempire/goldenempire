class Pool
  sparkList : [] # [ < sparks > ]
  connections : [] # [ userId, sparkId, < count of current user connections to the same FRONT ~~ open pages on browser> ]
  constructor : ()->
    @sparkList = []
    @connections = []

  logTotals: () ->
    frontCount = 0
    connCount = 0
    userList = {}
    for conn in @connections
      userList[conn[0]] ?= {}
      userList[conn[0]][conn[1]] = true
      connCount += conn[2]
      frontCount = Math.max frontCount, Object.keys(userList[conn[0]]).length
    userList = Object.keys userList
    console.log '@connections=', @connections
    console.log "FRONTS: #{frontCount} / USERS: #{userList.length} / CONNECTIONS: #{connCount}"

  connectionPos: (sparkId, userId = null) ->
    for v, i in @connections
      continue if v[1] != sparkId
      if v[0] == userId and userId
        return i
    -1
    #(i for v, i in @connections when v[1] == sparkId)[0] and ( v[0] == userId and userId )

  # when brokes connection on Front_K <-> Balance
  removeSpark: (spark) ->
    pos = @sparkList.indexOf spark
    if -1!=pos
      removedSpark = @sparkList.splice pos, 1
      console.log 'Pool spark removed', removedSpark[0].id, ". Total #{@sparkList.length} sparks."

      # delete all connections with this spark because the spakr was ended
      while -1 != i = @connectionPos spark.id
        conn = @connections.splice i, 1
        console.log 'Pool closed connection with', conn[0]

    # remove all connections with that spark
    i = 0
    while @connections[i]
      if @connections[i][1] == spark.id
        conn = @connections.splice i, 1
        console.log 'Pool connection removed', conn[0]
      else
        i++

    @logTotals()


  # telling that some user from some frontend do not want to reseive notifications
  # but another users on the same frontend will continue to send/reseive notifications
  # that is why there is no need to "removeSpark"
  unsubscribe: (data, spark) ->
    console.log "Pool unsubscribe", data
    { userId } = data
    if userId and -1 != pos = @connectionPos spark.id, userId
      @connections[pos][2]--;
      console.log "Pool decremented user connection count", @connections[pos]

      if userId and !@connections[pos][2]
        conn = @connections.splice pos, 1
        console.log "Pool closed connection for user #{conn[0]}"
    else
      # no need to remove spark while FRONT is connected
      # do nothing if no connection was found
      # no need to remove spark while FRONT is connected

    @logTotals()

  subscribe: (data, spark) ->
    console.log "Pool subscribe", data
    { userId } = data
    if -1==@sparkList.indexOf spark
      @sparkList.push spark
      console.log 'Pool spark added', spark.id, ". Total #{@sparkList.length} sparks."

    if userId and -1 != pos = @connectionPos spark.id, userId
      # if connection already exists - increment connection count
      @connections[pos][2]++
      console.log "Pool new connection appended", @connections[pos]
    else
      conn = [ userId, spark.id, 1 ]
      @connections.push conn
      console.log "Pool new connection established", conn

      spark.on 'reconnect', =>
        console.log 'spark', spark.id, 'reconnect'

      # one handler per one ADDED spark
      spark.on 'end', =>
        console.log 'spark', spark.id, 'end'
        @removeSpark spark

    @logTotals()

  notify: (userId, data) ->
    console.log 'Pool notification', userId, data
    for conn in @connections
      #console.log 'user connection', conn[0], userId, conn[0] == userId
      continue if conn[0] != userId
      for spark in @sparkList
        #console.log 'user spark', spark.id, conn[1], spark.id == conn[1]
        if spark.id == conn[1]
          #console.log 'notification spark', spark.id
          spark.write data
    return

module.exports = Pool