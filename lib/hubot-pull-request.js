
var HubotPullRequest, PullRequestManager;

PullRequestManager = require('./clients/pull-request-manager').PullRequestManager;

HubotPullRequest = (function() {
  function HubotPullRequest(arg) {
    var ref;
    ref = arg != null ? arg : {}, this.timeout = ref.timeout, this.token = ref.token, this.space = ref.space;
    if (this.timeout == null) {
      this.timeout = '30000';
    }
    this.waitList = [];
  }

  HubotPullRequest.prototype.cancel = function(res) {
    var item, number, repo, user;
    item = this._itemFor(res);
    if (item == null) {
      return;
    }
    this._removeItem(item);
    user = item.user, repo = item.repo, number = item.number;
    return res.send("canceled: " + user + "/" + repo + "#" + number);
  };

  HubotPullRequest.prototype.confirmMerging = function(res, user, repo, number, issueKey) {
    var client;
    if (issueKey == null) {
      issueKey = null;
    }
    client = this._client();
    return client.get(user, repo, number).then((function(_this) {
      return function(result) {
        var room, timeout, timerId, userId;
        res.send("\#" + result.number + " " + result.title + "\n" + result.base.label + " <- " + result.head.label + "\n" + result.html_url + "\n\nOK ? [yes/no]");
        timeout = parseInt(_this.timeout, 10);
        userId = res.message.user.id;
        room = res.message.room;
        timerId = setTimeout(function() {
          return _this.waitList = _this.waitList.filter(function(i) {
            return i.timerId !== timerId;
          });
        }, timeout);
        return _this.waitList.push({
          userId: userId,
          room: room,
          user: user,
          repo: repo,
          number: number,
          timerId: timerId,
          issueKey: issueKey
        });
      };
    })(this)).then(null, function(err) {
      res.robot.logger.error(err);
      return res.send('hubot-fgb: error');
    });
  };

  HubotPullRequest.prototype.confirmMergingIssueNo = function(res, user, repo, issueNo) {
    var client;
    client = this._client();
    return client.list(user, repo).then((function(_this) {
      return function(pulls) {
        var issueKey, matches;
        if (pulls.length === 0) {
          return res.send('no pr');
        }
        issueKey = null;
        matches = pulls.filter(function(p) {
          var matched, pattern;
          pattern = new RegExp('^([0-9A-Z_]+-' + issueNo + ')');
          matched = p.title.match(pattern);
          if (matched != null) {
            issueKey = matched[1];
          }
          return matched != null;
        });
        if (matches.length === 0) {
          return res.send('no pr');
        }
        return _this.confirmMerging(res, user, repo, matches[0].number, issueKey);
      };
    })(this));
  };

  HubotPullRequest.prototype.list = function(res, user, repo) {
    var client;
    client = this._client();
    return client.list(user, repo).then(function(pulls) {
      var message;
      if (pulls.length === 0) {
        return res.send('no pr');
      }
      message = pulls.map(function(p) {
        return "\#" + p.number + " " + p.title + "\n  " + p.html_url;
      }).join('\n');
      return res.send(message);
    }).then(null, function(err) {
      res.robot.logger.error(err);
      return res.send('hubot-fgb: error');
    });
  };

  HubotPullRequest.prototype.merge = function(res) {
    var client, issueKey, item, number, repo, user;
    item = this._itemFor(res);
    if (item == null) {
      return;
    }
    this._removeItem(item);
    user = item.user, repo = item.repo, number = item.number, issueKey = item.issueKey;
    client = this._client();
    return client.merge(user, repo, number).then((function(_this) {
      return function(result) {
        res.send("merged: " + user + "/" + repo + "#" + number + " : " + result.message);
        if (issueKey != null) {
          return _this.space.returnIssue(issueKey);
        }
      };
    })(this)).then(null, function(err) {
      res.robot.logger.error(err);
      return res.send('hubot-fgb: error');
    });
  };

  HubotPullRequest.prototype.reject = function(res, user, repo, number) {
    var client;
    client = this._client();
    return client.reject(user, repo, number).then(function(result) {
      return res.send("rejected: " + user + "/" + repo + "#" + number + "\n" + result.html_url);
    }).then(null, function(err) {
      res.robot.logger.error(err);
      return res.send('hubot-fgb: error');
    });
  };

  HubotPullRequest.prototype.review = function(res, user, repo, number, reviewer) {
    var client;
    client = this._client();
    return client.review(user, repo, number, reviewer).then(function(result) {
      return res.send("assigned: " + user + "/" + repo + "#" + number + " > " + reviewer + "\n" + result.html_url);
    }).then(null, function(err) {
      res.robot.logger.error(err);
      return res.send('hubot-fgb: error');
    });
  };

  HubotPullRequest.prototype._client = function() {
    return new PullRequestManager({
      token: this.token
    });
  };

  HubotPullRequest.prototype._itemFor = function(res) {
    var room, userId;
    userId = res.message.user.id;
    room = res.message.room;
    return this.waitList.filter(function(i) {
      return i.userId === userId && i.room === room;
    })[0];
  };

  HubotPullRequest.prototype._removeItem = function(item) {
    return this.waitList = this.waitList.filter(function(i) {
      return i.timerId !== item.timerId;
    });
  };

  return HubotPullRequest;

})();

module.exports.HubotPullRequest = HubotPullRequest;
