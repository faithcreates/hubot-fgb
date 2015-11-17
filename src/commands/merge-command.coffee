module.exports = ({ pr, config, robot }) ->
  pattern = /merge\s+(?:([^\/]+)\/)?([^#]+)(?:#(\d+))?\s*$/i
  robot.respond pattern, (res) ->
    user = res.match[1] ? config.mergeDefaultUsername
    return unless user?
    repo = res.match[2]
    number = res.match[3]
    role = 'merge-' + repo
    return res.send("you does not have #{role} role") \
      unless robot.auth?.hasRole(res.envelope.user, role)
    f = if number?
      pr.confirmMerging
    else
      pr.list
    f.apply pr, [res, user, repo, number]
