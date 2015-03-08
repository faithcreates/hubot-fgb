
var Project;

Project = (function() {
  function Project(key1, room1) {
    this.key = key1;
    this.room = room1;
  }

  Project.prototype.getKey = function() {
    return this.key;
  };

  Project.prototype.getRoom = function() {
    return this.room;
  };

  return Project;

})();

module.exports = function(key, room) {
  return new Project(key, room);
};

module.exports.Project = Project;
