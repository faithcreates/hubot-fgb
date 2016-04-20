
var Space, newBacklog, newProject;

newBacklog = require('./clients/backlog');

newProject = require('./project');

Space = (function() {
  function Space(config) {
    var json, ref, ref1;
    json = (ref = config.projects) != null ? ref : '{}';
    this.rooms = JSON.parse(json);
    json = (ref1 = config.users) != null ? ref1 : '{}';
    this.users = JSON.parse(json);
    this.id = config.backlogSpaceId;
    this.backlog = newBacklog({
      spaceId: config.backlogSpaceId,
      username: config.backlogUsername,
      apiKey: config.backlogApiKey
    });
  }

  Space.prototype.assign = function(project, issueKey, slackUsername) {
    var backlogUsername;
    backlogUsername = this.getBacklogUser(slackUsername);
    return this.backlog.getProjectUsers(project.getKey()).then((function(_this) {
      return function(users) {
        var u, userId;
        userId = ((function() {
          var l, len, results;
          results = [];
          for (l = 0, len = users.length; l < len; l++) {
            u = users[l];
            if (u.name === backlogUsername) {
              results.push(u.id);
            }
          }
          return results;
        })())[0];
        if (userId == null) {
          return;
        }
        return _this.getGitHubUrl(issueKey).then(function(url) {
          return _this.backlog.updateIssue(issueKey, {
            comment: "レビューをお願いしたいみたい。\n" + url,
            assigneeId: userId
          });
        });
      };
    })(this));
  };

  Space.prototype.fetchIssue = function(issueKey) {
    return this.backlog.getIssue(issueKey);
  };

  Space.prototype.updateIssue = function(issueKey, data) {
    return this.backlog.updateIssue(issueKey, data);
  };

  Space.prototype.getGitHubUrl = function(issueKey) {
    return this.backlog.getIssueComments(issueKey, {
      order: 'desc'
    }).then(function(comments) {
      var urls;
      urls = comments.map(function(i) {
        return i.content;
      }).filter(function(i) {
        return i;
      }).map(function(i) {
        return i.match(/(https:\/\/github\.com\/\S+)/);
      }).filter(function(i) {
        return i;
      }).map(function(i) {
        return i[1];
      }).filter(function(i) {
        return i;
      });
      return urls[0];
    });
  };

  Space.prototype.getId = function() {
    return this.id;
  };

  Space.prototype.getProject = function(projectKey) {
    var room;
    room = this.rooms[projectKey];
    if (room == null) {
      return null;
    }
    return newProject(projectKey, room);
  };

  Space.prototype.getUser = function(backlogUsername) {
    var ref;
    return (ref = this.users[backlogUsername]) != null ? ref : null;
  };

  Space.prototype.getBacklogUser = function(user) {
    var backlogUsers, k, ref, v;
    backlogUsers = (function() {
      var ref, results;
      ref = this.users;
      results = [];
      for (k in ref) {
        v = ref[k];
        if (v === user) {
          results.push(k);
        }
      }
      return results;
    }).call(this);
    return (ref = backlogUsers[0]) != null ? ref : null;
  };

  Space.prototype.getPreviousAssigner = function(comments) {
    var assigner;
    assigner = null;
    comments.some(function(i) {
      var logs;
      if (i.changeLog == null) {
        return false;
      }
      logs = i.changeLog.filter(function(j) {
        return j.field === 'assigner';
      });
      if (logs.length === 0) {
        return false;
      }
      assigner = logs[0].originalValue;
      return true;
    });
    return assigner;
  };

  return Space;

})();

module.exports = function(config) {
  return new Space(config);
};

module.exports.Space = Space;
