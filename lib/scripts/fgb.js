// Description
//   A Hubot script to support FGB
//
// Configuration:
//   HUBOT_FGB_BACKLOG_SPACE_ID
//   HUBOT_FGB_BACKLOG_USERNAME
//   HUBOT_FGB_BACKLOG_API_KEY
//   HUBOT_FGB_PROJECTS
//   HUBOT_FGB_USERS
//
// Commands:
//   None
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var Promise, config, formatChanges, newRequests, newSpace, onIssueCommented, onIssueCreated, onIssueUpdated, parseConfig, sendToChat;

Promise = require('es6-promise').Promise;

parseConfig = require('hubot-config');

formatChanges = require('../format-changes');

newRequests = require('../review-requests');

newSpace = require('../space');

config = parseConfig('fgb', {
  backlogSpaceId: null,
  backlogUsername: null,
  backlogApiKey: null,
  projects: '{}',
  users: '{}'
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

onIssueCreated = function(robot, space, project, w) {
  var description, issueKey, issueUrl, message, room, summary, username;
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

onIssueUpdated = function(robot, space, project, w, requests) {
  var assign, assignerName, changes, comment, description, inProgress, issueKey, issueUrl, m, message, resolved, room, summary, user, username;
  issueKey = (project.getKey()) + "-" + w.content.key_id;
  issueUrl = "https://" + (space.getId()) + ".backlog.jp/view/" + issueKey;
  summary = w.content.summary;
  description = w.content.description;
  username = w.createdUser.name;
  comment = w.content.comment.content;
  room = project.getRoom();
  changes = formatChanges(w.content.changes);
  inProgress = w.content.changes.some(function(i) {
    return i.field === 'status' && i.new_value === '2';
  });
  resolved = w.content.changes.some(function(i) {
    return i.field === 'status' && i.new_value === '3';
  });
  assign = w.content.changes.filter(function(i) {
    return i.field === 'assigner';
  })[0];
  assignerName = assign != null ? assign.new_value : void 0;
  message = username + " が課題「" + issueKey + " " + summary + "」を更新したみたい。\n" + comment + "\n```\n" + changes + "\n```\n" + issueUrl;
  m = {
    room: room,
    message: message
  };
  if ((assignerName != null) && !inProgress) {
    m.user = space.getUser(assignerName);
  }
  sendToChat(robot, m);
  if (resolved) {
    user = space.getUser(username);
    if (user == null) {
      robot.logger.warning('hubot-fgb: unknown backlog user: ' + username);
      return;
    }
    requests.add(room, user, {
      project: project,
      issueKey: issueKey
    });
    message = issueKey + " を誰にレビュー依頼する？";
    return sendToChat(robot, {
      room: room,
      user: user,
      message: message
    });
  }
};

onIssueCommented = function(robot, space, project, w) {
  var comment, commentId, description, issueKey, issueUrl, message, room, summary, username;
  issueKey = (project.getKey()) + "-" + w.content.key_id;
  issueUrl = "https://" + (space.getId()) + ".backlog.jp/view/" + issueKey;
  summary = w.content.summary;
  description = w.content.description;
  username = w.createdUser.name;
  commentId = w.content.comment.id;
  comment = w.content.comment.content;
  room = project.getRoom();
  message = username + " が課題「" + issueKey + " " + summary + "」にコメントしたみたい。\n" + comment + "\n" + issueUrl + "#comment-" + commentId;
  return sendToChat(robot, {
    room: room,
    message: message
  });
};

module.exports = function(robot) {
  var requests, space;
  robot.logger.debug('hubot-fgb: load config: ' + JSON.stringify(config));
  space = newSpace(config);
  requests = newRequests();
  robot.respond(/\s*@([-\w]+):?\s*/, function(res) {
    var data, issueKey, project, ref, ref1, ref2, room, slackAssigneeUsername, user;
    room = res != null ? (ref = res.message) != null ? ref.room : void 0 : void 0;
    user = res != null ? (ref1 = res.message) != null ? (ref2 = ref1.user) != null ? ref2.name : void 0 : void 0 : void 0;
    data = requests.remove(room, user);
    if (data == null) {
      return;
    }
    project = data.project, issueKey = data.issueKey;
    slackAssigneeUsername = res.match[1];
    return space.assign(project, issueKey, slackAssigneeUsername).then(function() {
      return robot.logger.debug("hubot-fgb: assign issue: " + issueKey + " to " + slackAssigneeUsername);
    })["catch"](function(e) {
      robot.logger.error('hubot-fgb: assign error');
      return robot.logger.error(e);
    });
  });
  return robot.router.post('/hubot/fgb/backlog/webhook', function(req, res) {
    var project, projectKey, ref, webhook;
    webhook = req.body;
    if ((ref = webhook.type) === 1 || ref === 2 || ref === 3) {
      projectKey = webhook.project.projectKey;
      project = space.getProject(projectKey);
      if (project == null) {
        robot.logger.warning('hubot-fgb: unknown project key: ' + projectKey);
        return;
      }
      switch (webhook.type) {
        case 1:
          onIssueCreated(robot, space, project, webhook);
          break;
        case 2:
          onIssueUpdated(robot, space, project, webhook, requests);
          break;
        case 3:
          onIssueCommented(robot, space, project, webhook);
      }
    } else {
      if (webhook.type <= 17) {
        return;
      }
      robot.logger.warning("hubot-fgb: unknown webhook type: " + webhook.type);
    }
    return res.send('OK');
  });
};
