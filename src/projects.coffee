newProject = require './project'

class Projects
  constructor: (config) ->
    # @rooms ... projectKey: room
    json = config.projects ? '{}'
    @rooms = JSON.parse json

  getProject: (projectKey) ->
    room = @rooms[projectKey]
    return null unless room?
    newProject projectKey, room

module.exports = (config) ->
  new Projects config

module.exports.Projects = Projects
