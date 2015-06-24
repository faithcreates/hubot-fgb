
var PullRequestManager, fetchPullRequestDataFromIssue, newSpace, resolveIssue;

PullRequestManager = require('../pull-request-manager').PullRequestManager;

newSpace = require('../space');

fetchPullRequestDataFromIssue = function(space, issueKey) {
  return space.fetchIssue(issueKey).then(function(issue) {
    var base, head, match, message, ref, summary, title;
    summary = (ref = issue.summary) != null ? ref : '';
    match = summary.match(/^\[\s*(\S+)\s*<-\s*(\S+)\s*\]\s*(.+)$/);
    if (match == null) {
      message = JSON.stringify({
        errors: [
          {
            message: 'no issue'
          }
        ]
      });
      throw new Error(message);
    }
    head = match[1];
    base = match[2];
    title = match[3];
    return {
      head: head,
      base: base,
      title: title
    };
  })["catch"](function(e) {
    var message;
    message = JSON.parse(e.message).errors[0].message;
    throw new Error(message);
  });
};

resolveIssue = function(space, issueKey) {
  return space.updateIssue(issueKey, {
    statusId: 3
  })["catch"](function(e) {
    var message;
    message = JSON.parse(e.message).errors[0].message;
    throw new Error(message);
  });
};

module.exports = function(arg) {
  var config, robot;
  config = arg.config, robot = arg.robot;
  return robot.respond(/deploy\s+(?:([^\/]+)\/)?(\S+)\s+(\S+)-(\d+)\s*$/i, function(res) {
    var issueKey, issueNo, projectKey, ref, repo, space, user;
    user = (ref = res.match[1]) != null ? ref : config.mergeDefaultUsername;
    if (user == null) {
      return;
    }
    repo = res.match[2];
    projectKey = res.match[3];
    issueNo = res.match[4];
    issueKey = projectKey + '-' + issueNo;
    space = newSpace(config);
    return fetchPullRequestDataFromIssue(space, issueKey).then(function(arg1) {
      var base, head, title;
      head = arg1.head, base = arg1.base, title = arg1.title;
      return resolveIssue(space, issueKey).then(function() {
        var pr;
        pr = new PullRequestManager({
          token: config.githubToken
        });
        return pr.create(user, repo, title, base, head);
      });
    }).then(function(result) {
      return res.send('created: pull request ' + result.html_url);
    })["catch"](function(e) {
      return res.send('hubot-fgb: ' + e.message);
    });
  });
};
