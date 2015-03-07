newProject = require './project'

class Space
  constructor: (config) ->
    # @rooms ... projectKey: room
    json = config.projects ? '{}'
    @rooms = JSON.parse json
    @id = config.backlogSpaceId

  getId: ->
    @id

  getProject: (projectKey) ->
    room = @rooms[projectKey]
    return null unless room?
    newProject projectKey, room

module.exports = (config) ->
  new Space config

module.exports.Space = Space
