moment = require 'moment'

class ReviewRequests
  constructor: ->
    # room:
    #   user: {}
    @requests = {}

  add: (room, user, data) ->
    @requests[room] ?= {}
    data.expiredAt = moment().add 30, 'seconds'
    @requests[room][user] = data

  remove: (room, user) ->
    return null unless room?
    return null unless user?
    return null unless @requests[room]?
    data = @requests[room][user]
    return null unless data?
    delete @requests[room][user]
    if data.expiredAt.isAfter(moment()) then data else null

module.exports = ->
  new ReviewRequests

module.exports.ReviewRequests = ReviewRequests
