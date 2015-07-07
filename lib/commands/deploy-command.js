
var PullRequestManager, fetchPullRequestDataFromIssue, newSpace, resolveIssue;

PullRequestManager = require('../pull-request-manager').PullRequestManager;

newSpace = require('../space');

fetchPullRequestDataFromIssue = function(space, issueKey, issueUrl) {
  return space.fetchIssue(issueKey).then(function(issue) {
    var base, body, head, match, message, ref, repo, summary, title, user, userAndRepo;
    summary = (ref = issue.summary) != null ? ref : '';
    match = summary.match(/^\[\s*([^:]+?)\s*:\s*(\S+)\s*<-\s*(\S+)\s*\]\s*(.+)$/);
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
    userAndRepo = match[1];
    base = match[2];
    head = match[3];
    title = issueKey + ' ' + match[4];
    match = userAndRepo.match(/^(?:([^\/]+)\/)?(\S+)$/);
    user = match[1];
    repo = match[2];
    body = issueUrl;
    return {
      user: user,
      repo: repo,
      head: head,
      base: base,
      title: title,
      body: body
    };
  })["catch"](function(e) {
    var message;
    message = JSON.parse(e.message).errors[0].message;
    throw new Error(message);
  });
};

resolveIssue = function(space, issueKey, prUrl) {
  return space.updateIssue(issueKey, {
    statusId: 3,
    comment: prUrl
  })["catch"](function(e) {
    var message;
    message = JSON.parse(e.message).errors[0].message;
    throw new Error(message);
  });
};

module.exports = function(arg) {
  var config, robot;
  config = arg.config, robot = arg.robot;
  return robot.respond(/deploy\s+(\S+)-(\d+)\s*$/i, function(res) {
    var issueKey, issueNo, issueUrl, projectKey, space;
    projectKey = res.match[1];
    issueNo = res.match[2];
    issueKey = projectKey + '-' + issueNo;
    space = newSpace(config);
    issueUrl = "https://" + (space.getId()) + ".backlog.jp/view/" + issueKey;
    return fetchPullRequestDataFromIssue(space, issueKey, issueUrl).then(function(arg1) {
      var base, body, head, pr, repo, title, user;
      user = arg1.user, repo = arg1.repo, head = arg1.head, base = arg1.base, title = arg1.title, body = arg1.body;
      if (user == null) {
        user = config.mergeDefaultUsername;
      }
      pr = new PullRequestManager({
        token: config.githubToken
      });
      return pr.create(user, repo, title, base, head, body);
    }).then(function(result) {
      res.send('created: pull request ' + result.html_url);
      return resolveIssue(space, issueKey, result.html_url);
    })["catch"](function(e) {
      return res.send('hubot-fgb: ' + e.message);
    });
  });
};
