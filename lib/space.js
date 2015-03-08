
var Space, newProject;

newProject = require('./project');

Space = (function() {
  function Space(config) {
    var json, ref;
    json = (ref = config.projects) != null ? ref : '{}';
    this.rooms = JSON.parse(json);
    this.id = config.backlogSpaceId;
  }

  Space.prototype.getId = function() {
    return this.id;
  };

  Space.prototype.getProject = function(projectKey) {
    var room;
    room = this.rooms[projectKey];
    if (room == null) {
      return null;
    }
    return newProject(projectKey, room);
  };

  return Space;

})();

module.exports = function(config) {
  return new Space(config);
};

module.exports.Space = Space;
