// Description
//   A Hubot script to support FGB
//
// Configuration:
//   HUBOT_FGB_BACKLOG_API_KEY
//   HUBOT_FGB_BACKLOG_SPACE_ID
//   HUBOT_FGB_BACKLOG_USERNAME
//   HUBOT_FGB_GITHUB_TOKEN
//   HUBOT_FGB_MERGE_DEFAULT_USERNAME
//   HUBOT_FGB_MERGE_TIMEOUT
//   HUBOT_FGB_PROJECTS
//   HUBOT_FGB_USERS
//   HUBOT_FGB_GITHUB_USERS
//
// Commands:
//   hubot deploy [<user>/]<repo> <issue-key> ... create pull request to deploy
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var HubotPullRequest, addAssignCommand, addDeployCommand, addMergeCommand, addPrCommand, addRejectCommand, addReviewCommand, addYesNoCommand, config, newSpace, parseConfig;

parseConfig = require('hubot-config');

addAssignCommand = require('../commands/assign-command');

addDeployCommand = require('../commands/deploy-command');

addMergeCommand = require('../commands/merge-command');

addPrCommand = require('../commands/pr-command');

addRejectCommand = require('../commands/reject-command');

addReviewCommand = require('../commands/review-command');

addYesNoCommand = require('../commands/yes-no-command');

newSpace = require('../space');

HubotPullRequest = require('../hubot-pull-request').HubotPullRequest;

config = parseConfig('fgb', {
  backlogApiKey: null,
  backlogSpaceId: null,
  backlogUsername: null,
  githubToken: null,
  mergeDefaultUsername: 'faithcreates',
  mergeTimeout: null,
  projects: '{}',
  users: '{}',
  githubUsers: '{}'
});

module.exports = function(robot) {
  var pr, space;
  robot.logger.debug('hubot-fgb: load config: ' + JSON.stringify(config));
  space = newSpace(config);
  pr = new HubotPullRequest({
    timeout: config.mergeTimeout,
    token: config.githubToken,
    space: space
  });
  addAssignCommand({
    config: config,
    robot: robot
  });
  addDeployCommand({
    config: config,
    robot: robot
  });
  addMergeCommand({
    pr: pr,
    config: config,
    robot: robot
  });
  addPrCommand({
    pr: pr,
    config: config,
    robot: robot
  });
  addRejectCommand({
    pr: pr,
    config: config,
    robot: robot
  });
  addReviewCommand({
    pr: pr,
    config: config,
    robot: robot
  });
  return addYesNoCommand({
    pr: pr,
    robot: robot
  });
};
