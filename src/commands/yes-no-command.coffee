
module.exports = ({ pr, robot }) ->
  robot.hear /^y(?:es)?$/i, (res) ->
    pr.merge res

  robot.hear /^n(?:o)?$/i, (res) ->
    pr.cancel res
