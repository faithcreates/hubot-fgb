
var ReviewRequests;

ReviewRequests = (function() {
  function ReviewRequests() {
    this.requests = {};
  }

  ReviewRequests.prototype.add = function(room, user, issueKey) {
    var base;
    if ((base = this.requests)[room] == null) {
      base[room] = {};
    }
    return this.requests[room][user] = issueKey;
  };

  ReviewRequests.prototype.remove = function(room, user) {
    var issueKey;
    if (room == null) {
      return null;
    }
    if (user == null) {
      return null;
    }
    if (this.requests[room] == null) {
      return null;
    }
    issueKey = this.requests[room][user];
    if (issueKey == null) {
      return null;
    }
    delete this.requests[room][user];
    return issueKey;
  };

  return ReviewRequests;

})();

module.exports = function() {
  return new ReviewRequests;
};

module.exports.ReviewRequests = ReviewRequests;
