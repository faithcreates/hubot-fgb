class Project
  constructor: (@key, @room) ->

  getKey: ->
    @key

  getRoom: ->
    @room

module.exports = (key, room) ->
  new Project(key, room)

module.exports.Project = Project
