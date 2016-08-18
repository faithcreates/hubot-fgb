
module.exports = function(arg) {
  var config, pattern, pr, ref, robot, users;
  pr = arg.pr, config = arg.config, robot = arg.robot;
  users = JSON.parse((ref = config.githubUsers) != null ? ref : '{}');
  pattern = /^\s*[@]?([^:,\s]+)[:,]?\s*review\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i;
  return robot.hear(pattern, function(res) {
    var number, ref1, repo, reviewer, reviewerInSlack, user;
    reviewerInSlack = res.match[1];
    user = (ref1 = res.match[2]) != null ? ref1 : config.mergeDefaultUsername;
    if (user == null) {
      return;
    }
    reviewer = users[reviewerInSlack];
    if (reviewer == null) {
      return;
    }
    repo = res.match[3];
    number = res.match[4];
    return pr.review(res, user, repo, number, reviewer);
  });
};
