assert = require 'power-assert'
sinon = require 'sinon'
{HubotPullRequest} = require '../src/hubot-pull-request'
{PullRequestManager} = require '../src/clients/pull-request-manager'

describe 'HubotPullRequestManager', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @sinon.restore()

  describe '#constructor', ->
    it 'works', ->
      pr = new HubotPullRequest()
      assert typeof pr.cancel is 'function'
      assert typeof pr.confirmMerging is 'function'
      assert typeof pr.confirmMergingIssueNo is 'function'
      assert typeof pr.list is 'function'
      assert typeof pr.merge is 'function'
