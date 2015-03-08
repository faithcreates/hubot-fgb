assert = require 'power-assert'
newSpace = require '../src/space'

describe 'Space', ->
  it 'works', ->
    config =
      backlogSpaceId: 'spaceId'
      projects: '{"PROJ":"room"}'
      users: '{"backlog":"slack"}'
    space = newSpace config
    assert space.getId() is 'spaceId'
    assert space.getProject('PROJ') # Project instance
    assert space.getProject(null) is null
    assert space.getUser('backlog') is 'slack'
    assert space.getBacklogUser('slack') is 'backlog'
    # TODO: space.assign

    config =
      backlogSpaceId: null
      projects: null
      users: null
    space = newSpace config
    assert space.getId() is null
    assert space.getProject('PROJ') is null
    assert space.getUser('backlog') is null
    assert space.getBacklogUser('slack') is null
    # TODO: space.assign
