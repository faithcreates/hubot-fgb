{PullRequestManager} = require '../pull-request-manager'
newSpace = require '../space'

fetchPullRequestDataFromIssue = (space, issueKey) ->
  space.fetchIssue issueKey
  .then (issue) ->
    summary = issue.summary ? ''
    match = summary.match /^\[\s*(\S+)\s*<-\s*(\S+)\s*\]\s*(.+)$/
    unless match?
      message = JSON.stringify(errors: [message: 'no issue'])
      throw new Error(message)
    base = match[1]
    head = match[2]
    title = match[3]
    { head, base, title }
  .catch (e) ->
    message = JSON.parse(e.message).errors[0].message
    throw new Error(message)

resolveIssue = (space, issueKey) ->
  space.updateIssue issueKey, statusId: 3
  .catch (e) ->
    message = JSON.parse(e.message).errors[0].message
    throw new Error(message)

module.exports = ({ config, robot }) ->
  robot.respond /deploy\s+(?:([^\/]+)\/)?(\S+)\s+(\S+)-(\d+)\s*$/i, (res) ->
    user = res.match[1] ? config.mergeDefaultUsername
    return unless user?
    repo = res.match[2]
    projectKey = res.match[3]
    issueNo = res.match[4]
    issueKey = projectKey + '-' + issueNo
    space = newSpace config
    fetchPullRequestDataFromIssue space, issueKey
    .then ({ head, base, title }) ->
      resolveIssue space, issueKey
      .then ->
        # see head, base, title variables
        pr = new PullRequestManager
          token: config.githubToken
        pr.create user, repo, title, base, head
    .then (result) ->
      res.send 'created: pull request ' + result.html_url
    .catch (e) ->
      res.send 'hubot-fgb: ' + e.message
