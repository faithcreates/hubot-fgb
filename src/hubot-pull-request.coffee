{PullRequestManager} = require './pull-request-manager'

class HubotPullRequest
  constructor: ({ @timeout, @token } = {}) ->
    @timeout ?= '3000'
    @waitList = []

  cancel: (res) ->
    item = @_itemFor res
    return unless item?
    @_removeItem item
    { user, repo, number } = item
    res.send "canceled: #{user}/#{repo}##{number}"

  confirmMerging: (res, user, repo, number) ->
    client = @_client()
    client.get(user, repo, number)
    .then (result) =>
      res.send """
        \##{result.number} #{result.title}
        #{result.base.label} <- #{result.head.label}
        #{result.html_url}

        OK ? [yes/no]
      """
      timeout = parseInt @timeout, 10
      userId = res.message.user.id
      room = res.message.room
      timerId = setTimeout =>
        @waitList = @waitList.filter (i) -> i.timerId isnt timerId
      , timeout
      @waitList.push { userId, room, user, repo, number, timerId }
    .then null, (err) ->
      res.robot.logger.error err
      res.send 'hubot-fgb: error'

  confirmMergingIssueNo: (res, user, repo, issueNo) ->
    client = @_client()
    client.list(user, repo)
    .then (pulls) =>
      return res.send('no pr') if pulls.length is 0
      matches = pulls.filter (p) ->
        pattern = new RegExp('^[0-9A-Z_]+-' + issueNo)
        p.title.match pattern
      return res.send('no pr') if matches.length is 0
      @confirmMerging(res, user, repo, matches[0].number)

  list: (res, user, repo) ->
    client = @_client()
    client.list(user, repo)
    .then (pulls) ->
      return res.send('no pr') if pulls.length is 0
      message = pulls
        .map (p) -> """
            \##{p.number} #{p.title}
              #{p.html_url}
          """
        .join '\n'
      res.send message
    .then null, (err) ->
      res.robot.logger.error err
      res.send 'hubot-fgb: error'

  merge: (res) ->
    item = @_itemFor res
    return unless item?
    @_removeItem item
    { user, repo, number } = item
    client = @_client()
    client.merge(user, repo, number)
    .then (result) ->
      res.send "merged: #{user}/#{repo}##{number} : #{result.message}"
    .then null, (err) ->
      res.robot.logger.error err
      res.send 'hubot-fgb: error'

  _client: ->
    new PullRequestManager(token: @token)

  _itemFor: (res) ->
    userId = res.message.user.id
    room = res.message.room
    @waitList.filter((i) -> i.userId is userId and i.room is room)[0]

  _removeItem: (item) ->
    @waitList = @waitList.filter (i) -> i.timerId isnt item.timerId

module.exports.HubotPullRequest = HubotPullRequest
