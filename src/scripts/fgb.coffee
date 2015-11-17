# Description
#   A Hubot script to support FGB
#
# Configuration:
#   HUBOT_FGB_BACKLOG_API_KEY
#   HUBOT_FGB_BACKLOG_SPACE_ID
#   HUBOT_FGB_BACKLOG_USERNAME
#   HUBOT_FGB_GITHUB_TOKEN
#   HUBOT_FGB_MERGE_DEFAULT_USERNAME
#   HUBOT_FGB_MERGE_TIMEOUT
#   HUBOT_FGB_PROJECTS
#   HUBOT_FGB_USERS
#
# Commands:
#   hubot deploy [<user>/]<repo> <issue-key> ... create pull request to deploy
#
# Author:
#   bouzuya <m@bouzuya.net>
#

parseConfig = require 'hubot-config'
addAssignCommand = require '../commands/assign-command'
addDeployCommand = require '../commands/deploy-command'
addPrCommand = require '../commands/pr-command'

config = parseConfig 'fgb',
  backlogApiKey: null
  backlogSpaceId: null
  backlogUsername: null
  githubToken: null
  mergeDefaultUsername: 'faithcreates'
  mergeTimeout: null
  projects: '{}' # backlog project key -> slack channel
  users: '{}' # backlog user name -> slack user name

module.exports = (robot) ->
  robot.logger.debug 'hubot-fgb: load config: ' + JSON.stringify config

  addAssignCommand { config, robot }
  addDeployCommand { config, robot }
  addPrCommand { config, robot }
