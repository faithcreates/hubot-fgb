assert = require 'power-assert'
{Project} = require '../src/project'

describe 'Project', ->
  it 'works', ->
    project = new Project 'key', 'room'
    assert project.getKey() is 'key'
    assert project.getRoom() is 'room'
