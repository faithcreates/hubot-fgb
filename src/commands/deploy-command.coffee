{PullRequestManager} = require '../pull-request-manager'
newSpace = require '../space'

fetchPullRequestDataFromIssue = (space, issueKey) ->
  space.fetchIssue issueKey
  .then (issue) ->
    summary = issue.summary ? ''
    match = summary.match /^\[\s*([^:]+?)\s*:\s*(\S+)\s*<-\s*(\S+)\s*\]\s*(.+)$/
    unless match?
      message = JSON.stringify(errors: [message: 'no issue'])
      throw new Error(message)
    userAndRepo = match[1]
    base = match[2]
    head = match[3]
    title = match[4]
    match = userAndRepo.match /^(?:([^\/]+)\/)?(\S+)$/
    user = match[1]
    repo = match[2]
    { user, repo, head, base, title }
  .catch (e) ->
    message = JSON.parse(e.message).errors[0].message
    throw new Error(message)

resolveIssue = (space, issueKey) ->
  space.updateIssue issueKey, statusId: 3
  .catch (e) ->
    message = JSON.parse(e.message).errors[0].message
    throw new Error(message)

module.exports = ({ config, robot }) ->
  robot.respond /deploy\s+(\S+)-(\d+)\s*$/i, (res) ->
    projectKey = res.match[1]
    issueNo = res.match[2]
    issueKey = projectKey + '-' + issueNo
    space = newSpace config
    fetchPullRequestDataFromIssue space, issueKey
    .then ({ user, repo, head, base, title }) ->
      user ?= config.mergeDefaultUsername
      resolveIssue space, issueKey
      .then ->
        pr = new PullRequestManager
          token: config.githubToken
        pr.create user, repo, title, base, head
    .then (result) ->
      res.send 'created: pull request ' + result.html_url
    .catch (e) ->
      res.send 'hubot-fgb: ' + e.message
