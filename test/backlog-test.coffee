assert = require 'power-assert'
sinon = require 'sinon'
request = require 'request'
{Backlog} = require '../src/backlog'

describe 'Backlog', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

    # load samplesd
    @samples = {}
    fs = require 'fs'
    path = require 'path'
    dir = './test/samples/'
    for file in fs.readdirSync dir
      key = path.basename file, '.json'
      @samples[key] = JSON.parse fs.readFileSync path.join dir, file

    # common data
    @projectKey = 'PROJ'
    @issueKey = 'PROJ-123'
    @backlog = new Backlog spaceId: 's', username: 'u', apiKey: 'a'

  afterEach ->
    @sinon.restore()

  describe '#getIssueComments', ->
    beforeEach ->
      @request = @sinon.stub request, 'Request', (options) =>
        res =
          statusCode: 200
          body: JSON.stringify @samples['get-issue-comments']
        options.callback null, res

    it 'works', ->
      @backlog.getIssueComments @issueKey
      .then (result) =>
        assert Array.isArray result
        assert result[0].content is 'LGTM'
        o = @request.getCall(0).args[0]
        assert o.url is 'https://s.backlog.jp/api/v2/issues/PROJ-123/comments'

  describe '#getProjectUsers', ->
    beforeEach ->
      @request = @sinon.stub request, 'Request', (options) =>
        res =
          statusCode: 200
          body: JSON.stringify @samples['get-project-users']
        options.callback null, res

    it 'works', ->
      @backlog.getProjectUsers @projectKey
      .then (result) =>
        assert Array.isArray result
        assert result[0].name is 'bouzuya3'
        o = @request.getCall(0).args[0]
        assert o.url is 'https://s.backlog.jp/api/v2/projects/PROJ/users'

  describe '#getWebhooks', ->
    beforeEach ->
      @request = @sinon.stub request, 'Request', (options) =>
        res =
          statusCode: 200
          body: JSON.stringify @samples['get-webhooks']
        options.callback null, res

    it 'works', ->
      @backlog.getWebhooks @projectKey
      .then (webhooks) =>
        assert Array.isArray webhooks
        assert webhooks[0].name is 'hubot-fgb'
        o = @request.getCall(0).args[0]
        assert o.url is 'https://s.backlog.jp/api/v2/projects/PROJ/webhooks'

  describe '#updateIssue', ->
    beforeEach ->
      @request = @sinon.stub request, 'Request', (options) =>
        res =
          statusCode: 200
          body: JSON.stringify @samples['update-issue']
        options.callback null, res

    it 'works', ->
      @backlog.updateIssue @issueKey, { comment: 'LGTM' }
      .then (result) =>
        assert result.issueKey is @issueKey
        o = @request.getCall(0).args[0]
        assert o.url is 'https://s.backlog.jp/api/v2/issues/PROJ-123'
        assert o.method is 'PATCH'
        assert.deepEqual o.form, { comment: 'LGTM' }

  describe '#_buildPath', ->
    it 'works', ->
      path = @backlog._buildPath '/a/:b/c/:d', b: 1, d: 2
      assert path is '/a/1/c/2'

  describe '#_buildRequestOptions', ->
    it 'works', ->
      original =
        path: '/p/:a'
        params:
          a: 1
        query:
          b: 2
      options = @backlog._buildRequestOptions original
      assert.deepEqual options,
        url: 'https://s.backlog.jp/p/1'
        qs:
          b: 2
          apiKey: 'a'
