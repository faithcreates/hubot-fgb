# Description
#   A Hubot script to support FGB
#
# Configuration:
#   HUBOT_FGB_BACKLOG_SPACE_ID
#   HUBOT_FGB_BACKLOG_USERNAME
#   HUBOT_FGB_BACKLOG_API_KEY
#   HUBOT_FGB_PROJECTS
#   HUBOT_FGB_USERS
#
# Commands:
#   None
#
# Author:
#   bouzuya <m@bouzuya.net>
#

parseConfig = require 'hubot-config'
addAssignCommand = require '../commands/assign-command'
addMergeCommand = require '../commands/merge-command'

config = parseConfig 'fgb',
  backlogApiKey: null
  backlogSpaceId: null
  backlogUsername: null
  githubToken: null
  mergeDefaultUsername: 'faithcreates'
  mergeTimeout: null
  projects: '{}'
  users: '{}'

module.exports = (robot) ->
  robot.logger.debug 'hubot-fgb: load config: ' + JSON.stringify config

  addAssignCommand { config, robot }
  addMergeCommand { config, robot }
