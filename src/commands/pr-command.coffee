newSpace = require '../space'
{HubotPullRequest} = require '../hubot-pull-request'

module.exports = ({ config, robot }) ->
  space = newSpace config
  pr = new HubotPullRequest
    timeout: config.mergeTimeout
    token: config.githubToken
    space: space

  pattern = /pr\s+(?:([^\/]+)\/)?(\S+)(?:\s+(#?\d+))?\s*$/i
  robot.respond pattern, (res) ->
    user = res.match[1] ? config.mergeDefaultUsername
    return unless user?
    repo = res.match[2]
    number = res.match[3]
    role = 'merge-' + repo
    return res.send("you does not have #{role} role") \
      unless robot.auth?.hasRole(res.envelope.user, role)
    f = if number?.match(/^#/)
      number = number.substring(1)
      pr.confirmMerging
    else if number?
      pr.confirmMergingIssueNo
    else
      pr.list
    f.apply pr, [res, user, repo, number]

  robot.hear /^y(?:es)?$/i, (res) ->
    pr.merge res

  robot.hear /^n(?:o)?$/i, (res) ->
    pr.cancel res
