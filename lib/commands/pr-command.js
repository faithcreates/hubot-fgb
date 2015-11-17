
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
  pattern = /pr\s+(?:([^\/]+)\/)?(\S+)(?:\s+(#?\d+))?\s*$/i;
  return robot.respond(pattern, function(res) {
    var f, number, ref, ref1, repo, role, user;
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
    f = (number != null ? number.match(/^#/) : void 0) ? (number = number.substring(1), pr.confirmMerging) : number != null ? pr.confirmMergingIssueNo : pr.list;
    return f.apply(pr, [res, user, repo, number]);
  });
};
