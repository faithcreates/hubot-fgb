class Projects
  constructor: (config) ->
    # projectKey: room
    @projects = JSON.parse(config.projects ? '{}')

  getRoom: (projectKey) ->
    @projects[projectKey] ? null

module.exports = ->
  new Projects

module.exports.Projects = Projects
