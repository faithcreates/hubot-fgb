newBacklog = require './backlog'
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
      @backlog.updateIssue issueKey,
        comment: 'レビューをお願いしたいみたい。'
        assigneeId: userId

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

module.exports = (config) ->
  new Space config

module.exports.Space = Space
