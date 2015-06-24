assert = require 'power-assert'
sinon = require 'sinon'
GitHub = require 'github'
{PullRequestManager} = require '../src/pull-request-manager'

describe 'PullRequestManager', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()
    @authenticate = @sinon.stub GitHub.prototype, 'authenticate', ->
      # do nothing

  afterEach ->
    @sinon.restore()

  describe '#constructor', ->
    it 'works', ->
      manager = new PullRequestManager(token: 'token123')
      assert @authenticate.callCount is 1
      assert.deepEqual @authenticate.getCall(0).args, [
        type: 'oauth'
        token: 'token123'
      ]
      assert typeof manager.get is 'function'
      assert typeof manager.list is 'function'
      assert typeof manager.merge is 'function'
