newSpace = require '../space'
{HubotPullRequest} = require '../hubot-pull-request'

module.exports = ({ config, robot }) ->
  space = newSpace config
  pr = new HubotPullRequest
    timeout: config.mergeTimeout
    token: config.githubToken
    space: space

  pattern = /^\s*[@]?\S+[:,]?\s*reject\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i
  robot.hear pattern, (res) ->
    user = res.match[1] ? config.mergeDefaultUsername
    return unless user?
    repo = res.match[2]
    number = res.match[3]
    role = 'merge-' + repo
    return res.send("you does not have #{role} role") \
      unless robot.auth?.hasRole(res.envelope.user, role)
    pr.reject res, user, repo, number
