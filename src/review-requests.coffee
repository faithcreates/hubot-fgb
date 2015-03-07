class ReviewRequests
  constructor: ->
    # room:
    #   user: issueKey
    @requests = {}

  add: (room, user, issueKey) ->
    @requests[room] ?= {}
    @requests[room][user] = issueKey

  remove: (room, user) ->
    return null unless room?
    return null unless user?
    return null unless @requests[room]?
    issueKey = @requests[room][user]
    return null unless issueKey?
    delete @requests[room][user]
    issueKey

module.exports = ->
  new ReviewRequests

module.exports.ReviewRequests = ReviewRequests
