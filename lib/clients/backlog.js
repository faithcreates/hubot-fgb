
var Backlog, Promise, request;

Promise = require('es6-promise').Promise;

request = require('request');

Backlog = (function() {
  function Backlog(arg) {
    var apiKey, apikey, spaceId, spaceid, userName, username;
    spaceid = arg.spaceid, spaceId = arg.spaceId, username = arg.username, userName = arg.userName, apikey = arg.apikey, apiKey = arg.apiKey;
    this._spaceId = spaceId != null ? spaceId : spaceid;
    this._username = username != null ? username : userName;
    this._apiKey = apiKey != null ? apiKey : apikey;
  }

  Backlog.prototype.getIssue = function(issueIdOrKey) {
    return this._request({
      path: '/api/v2/issues/:issueIdOrKey',
      params: {
        issueIdOrKey: issueIdOrKey
      }
    });
  };

  Backlog.prototype.getIssueComments = function(issueIdOrKey, query) {
    return this._request({
      path: '/api/v2/issues/:issueIdOrKey/comments',
      params: {
        issueIdOrKey: issueIdOrKey
      },
      query: query
    });
  };

  Backlog.prototype.getProjectUsers = function(projectIdOrKey) {
    return this._request({
      path: '/api/v2/projects/:projectIdOrKey/users',
      params: {
        projectIdOrKey: projectIdOrKey
      }
    });
  };

  Backlog.prototype.getWebhooks = function(projectIdOrKey) {
    return this._request({
      path: '/api/v2/projects/:projectIdOrKey/webhooks',
      params: {
        projectIdOrKey: projectIdOrKey
      }
    });
  };

  Backlog.prototype.updateIssue = function(issueIdOrKey, body) {
    return this._request({
      method: 'PATCH',
      path: '/api/v2/issues/:issueIdOrKey',
      params: {
        issueIdOrKey: issueIdOrKey
      },
      form: body
    });
  };

  Backlog.prototype._buildPath = function(path, params) {
    var pattern;
    if (params == null) {
      params = {};
    }
    pattern = new RegExp(':[^/]+', 'g');
    return path.replace(pattern, function(m) {
      return params[m.substring(1)];
    });
  };

  Backlog.prototype._buildRequestOptions = function(options) {
    var k, o, path, qs, ref, ref1, v;
    o = {};
    for (k in options) {
      v = options[k];
      o[k] = v;
    }
    path = this._buildPath(options.path, options.params);
    o.url = ("https://" + this._spaceId + ".backlog.jp") + path;
    qs = {};
    ref1 = (ref = options.query) != null ? ref : {};
    for (k in ref1) {
      v = ref1[k];
      qs[k] = v;
    }
    o.qs = qs;
    o.qs.apiKey = this._apiKey;
    delete o.path;
    delete o.params;
    delete o.query;
    return o;
  };

  Backlog.prototype._promisedRequest = function(options) {
    return new Promise(function(resolve, reject) {
      return request(options, function(err, res) {
        if (err != null) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  };

  Backlog.prototype._request = function(options) {
    return this._promisedRequest(this._buildRequestOptions(options)).then(function(res) {
      if (res.statusCode < 200 || 299 < res.statusCode) {
        throw new Error(res.body);
      }
      return JSON.parse(res.body);
    });
  };

  return Backlog;

})();

module.exports = function(options) {
  return new Backlog(options);
};

module.exports.Backlog = Backlog;
