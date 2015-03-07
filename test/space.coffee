assert = require 'power-assert'
newSpace = require '../src/space'

describe 'Space', ->
  it 'works', ->
    config =
      backlogSpaceId: 'spaceId'
      projects: '{"PROJ":"room"}'
    space = newSpace config
    assert space.getId() is 'spaceId'
    assert space.getProject('PROJ')
    assert space.getProject(null) is null

    config =
      backlogSpaceId: null
      projects: null
    space = newSpace config
    assert space.getId() is null
    assert space.getProject('PROJ') is null
