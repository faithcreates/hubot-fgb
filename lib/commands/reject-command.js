
var HubotPullRequest, newSpace;

newSpace = require('../space');

HubotPullRequest = require('../hubot-pull-request').HubotPullRequest;

module.exports = function(arg) {
  var config, pattern, pr, robot, space;
  config = arg.config, robot = arg.robot;
  space = newSpace(config);
  pr = new HubotPullRequest({
    timeout: config.mergeTimeout,
    token: config.githubToken,
    space: space
  });
  pattern = /^\s*[@]?\S+[:,]?\s*reject\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
  return robot.hear(pattern, function(res) {
    var number, ref, ref1, repo, role, user;
    user = (ref = res.match[1]) != null ? ref : config.mergeDefaultUsername;
    if (user == null) {
      return;
    }
    repo = res.match[2];
    number = res.match[3];
    role = 'merge-' + repo;
    if (!((ref1 = robot.auth) != null ? ref1.hasRole(res.envelope.user, role) : void 0)) {
      return res.send("you does not have " + role + " role");
    }
    return pr.reject(res, user, repo, number);
  });
};
