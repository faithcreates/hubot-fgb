assert = require 'power-assert'
{Projects} = require '../src/projects'

describe 'Projects', ->
  it 'works', ->
    config =
      projects: '{"PROJ":"room"}'
    projects = new Projects config
    assert projects.getProject('PROJ')
    assert projects.getProject(null) is null

    config =
      projects: null
    projects = new Projects config
    assert projects.getProject('PROJ') is null
