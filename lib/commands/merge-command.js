
module.exports = function(arg) {
  var config, pattern, pr, robot;
  pr = arg.pr, config = arg.config, robot = arg.robot;
  pattern = /merge\s+(?:([^\/]+)\/)?([^#]+)(?:#(\d+))?\s*$/i;
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
    f = number != null ? pr.confirmMerging : pr.list;
    return f.apply(pr, [res, user, repo, number]);
  });
};
