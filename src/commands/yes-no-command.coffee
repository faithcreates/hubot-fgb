newSpace = require '../space'
{HubotPullRequest} = require '../hubot-pull-request'

module.exports = ({ config, robot }) ->
  space = newSpace config
  pr = new HubotPullRequest
    timeout: config.mergeTimeout
    token: config.githubToken
    space: space

  robot.hear /^y(?:es)?$/i, (res) ->
    pr.merge res

  robot.hear /^n(?:o)?$/i, (res) ->
    pr.cancel res
