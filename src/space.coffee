newBacklog = require './clients/backlog'
newProject = require './project'

class Space
  constructor: (config) ->
    # @rooms ... projectKey: room
    json = config.projects ? '{}'
    @rooms = JSON.parse json
    # @users ... backlogUsername: slackUsername
    json = config.users ? '{}'
    @users = JSON.parse json
    @id = config.backlogSpaceId
    @backlog = newBacklog
      spaceId: config.backlogSpaceId
      username: config.backlogUsername
      apiKey: config.backlogApiKey

  # TODO: move to Issue
  # public
  assign: (project, issueKey, slackUsername) ->
    backlogUsername = @getBacklogUser slackUsername
    @backlog.getProjectUsers project.getKey()
    .then (users) =>
      userId = (u.id for u in users when u.name is backlogUsername)[0]
      return unless userId?
      # TODO: check resolved
      @getGitHubUrl issueKey
      .then (url) =>
        @backlog.updateIssue issueKey,
          comment: """
            レビューをお願いしたいみたい。
            #{url}
          """
          assigneeId: userId

  # public
  fetchIssue: (issueKey) ->
    @backlog.getIssue issueKey

  # public
  updateIssue: (issueKey, data) ->
    @backlog.updateIssue issueKey, data

  # public
  returnIssue: (issueKey) ->
    @backlog.getIssueComments issueKey
    .then (comments) =>
      assigner = @getPreviousAssigner comments
      projectKey = issueKey.replace /-\d+$/, ''
      @backlog.getProjectUsers projectKey
      .then (users) =>
        filtered = users.filter (i) ->
          i.name is assigner
        user = filtered[0]
        return unless user?
        @backlog.updateIssue issueKey,
          assigneeId: user.id
          comment: 'マージされたってさ'

  getGitHubUrl: (issueKey) ->
    @backlog.getIssueComments issueKey, { order: 'desc' }
    .then (comments) ->
      urls = comments
        .map (i) -> i.content
        .filter (i) -> i
        .map (i) -> i.match /(https:\/\/github\.com\/\S+)/
        .filter (i) -> i
        .map (i) -> i[1]
        .filter (i) -> i
      urls[0]

  getId: ->
    @id

  getProject: (projectKey) ->
    room = @rooms[projectKey]
    return null unless room?
    newProject projectKey, room

  # TODO: s/getUser/getSlackUser
  # backlog -> slack
  getUser: (backlogUsername) ->
    @users[backlogUsername] ? null

  # slack -> backlog
  getBacklogUser: (user) ->
    backlogUsers = (k for k, v of @users when v is user)
    backlogUsers[0] ? null

  getPreviousAssigner: (comments) ->
    assigner = null
    comments.some (i) ->
      return false unless i.changeLog?
      logs = i.changeLog.filter (j) ->
        j.field is 'assigner'
      return false if logs.length is 0
      assigner = logs[0].originalValue
      true
    assigner

module.exports = (config) ->
  new Space config

module.exports.Space = Space
