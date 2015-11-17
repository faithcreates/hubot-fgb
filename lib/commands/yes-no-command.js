
var HubotPullRequest, newSpace;

newSpace = require('../space');

HubotPullRequest = require('../hubot-pull-request').HubotPullRequest;

module.exports = function(arg) {
  var config, pr, robot, space;
  config = arg.config, robot = arg.robot;
  space = newSpace(config);
  pr = new HubotPullRequest({
    timeout: config.mergeTimeout,
    token: config.githubToken,
    space: space
  });
  robot.hear(/^y(?:es)?$/i, function(res) {
    return pr.merge(res);
  });
  return robot.hear(/^n(?:o)?$/i, function(res) {
    return pr.cancel(res);
  });
};
