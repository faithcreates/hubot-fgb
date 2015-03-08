// Description
//   A Hubot script to support FGB
//
// Configuration:
//   HUBOT_FGB_BACKLOG_SPACE_ID
//   HUBOT_FGB_PROJECTS
//
// Commands:
//   None
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var Promise, config, newSpace, onIssueCreated, parseConfig, sendToChat;

Promise = require('es6-promise').Promise;

parseConfig = require('hubot-config');

newSpace = require('../space');

config = parseConfig('fgb', {
  backlogSpaceId: null,
  projects: '{}'
});

sendToChat = function(robot, arg) {
  var e, m, message, room, user;
  room = arg.room, user = arg.user, message = arg.message;
  m = (user != null ? "<@" + user + "> " : '') + message;
  e = {};
  if (room != null) {
    e.room = room;
  }
  return robot.send(e, m);
};

onIssueCreated = function(robot, space, w) {
  var description, issueKey, issueUrl, message, project, projectKey, room, summary, username;
  projectKey = w.project.projectKey;
  project = space.getProject(projectKey);
  if (project == null) {
    robot.logger.warning('hubot-fgb: unknown project key: ' + projectKey);
    return;
  }
  issueKey = (project.getKey()) + "-" + w.content.key_id;
  issueUrl = "https://" + (space.getId()) + ".backlog.jp/view/" + issueKey;
  summary = w.content.summary;
  description = w.content.description;
  username = w.createdUser.name;
  room = project.getRoom();
  message = username + " が新しい課題「" + issueKey + " " + summary + "」を追加したみたい。\n" + description + "\n" + issueUrl;
  return sendToChat(robot, {
    room: room,
    message: message
  });
};

module.exports = function(robot) {
  var space;
  robot.logger.debug('hubot-fgb: load config: ' + JSON.stringify(config));
  space = newSpace(config);
  return robot.router.post('/hubot/fgb/backlog/webhook', function(req, res) {
    var webhook;
    webhook = req.body;
    if (webhook.type === 1) {
      onIssueCreated(robot, space, webhook);
    } else {
      robot.logger.debug("hubot-fgb: unknown webhook type: " + webhook.type);
    }
    return res.send('OK');
  });
};
