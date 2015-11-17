newSpace = require '../space'
{HubotPullRequest} = require '../hubot-pull-request'

module.exports = ({ config, robot }) ->
  # slack to github
  users = JSON.parse config.githubUsers ? '{}'
  @id = config.backlogSpaceId

  config.githubUsers
  space = newSpace config
  pr = new HubotPullRequest
    timeout: config.mergeTimeout
    token: config.githubToken
    space: space

  pattern = /^\s*[@]?([^:,]+)[:,]?\s*review\s+(?:([^\/]+)\/)?([^#]+)#(\d+)\s*$/i
  robot.hear pattern, (res) ->
    reviewerInSlack = res.match[1]
    user = res.match[2] ? config.mergeDefaultUsername
    return unless user?
    reviewer = users[reviewerInSlack]
    return unless reviewer?
    repo = res.match[3]
    number = res.match[4]
    pr.review res, user, repo, number, reviewer
