{Promise} = require 'es6-promise'
request = require 'request'

class Backlog
  constructor: ({ spaceid, spaceId, username, userName, apikey, apiKey }) ->
    @_spaceId = spaceId ? spaceid
    @_username = username ? userName
    @_apiKey = apiKey ? apikey

  getWebhooks: (projectIdOrKey) ->
    @_request
      path: '/api/v2/projects/:projectIdOrKey/webhooks'
      params: { projectIdOrKey }

  _buildPath: (path, params) ->
    params ?= {}
    pattern = new RegExp ':[^/]+', 'g'
    path.replace pattern, (m) -> params[m.substring 1]

  _buildRequestOptions: (options) ->
    o = {}
    o[k] = v for k, v of options
    path = @_buildPath options.path, options.params
    o.url = "https://#{@_spaceId}.backlog.jp" + path
    qs = {}
    qs[k] = v for k, v of (options.query ? {})
    o.qs = qs
    o.qs.apiKey = @_apiKey
    delete o.path
    delete o.params
    delete o.query
    o

  _promisedRequest: (options) ->
    new Promise (resolve, reject) ->
      request options, (err, res) ->
        return reject err if err?
        resolve res

  _request: (options) ->
    @_promisedRequest @_buildRequestOptions options
    .then (res) ->
      throw new Error res.body if res.statusCode < 200 or 299 < res.statusCode
      JSON.parse res.body

module.exports = (options) ->
  new Backlog options

module.exports.Backlog = Backlog
