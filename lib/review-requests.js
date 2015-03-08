
var ReviewRequests, moment;

moment = require('moment');

ReviewRequests = (function() {
  function ReviewRequests() {
    this.requests = {};
  }

  ReviewRequests.prototype.add = function(room, user, data) {
    var base;
    if ((base = this.requests)[room] == null) {
      base[room] = {};
    }
    data.expiredAt = moment().add(30, 'seconds');
    return this.requests[room][user] = data;
  };

  ReviewRequests.prototype.remove = function(room, user) {
    var data;
    if (room == null) {
      return null;
    }
    if (user == null) {
      return null;
    }
    if (this.requests[room] == null) {
      return null;
    }
    data = this.requests[room][user];
    if (data == null) {
      return null;
    }
    delete this.requests[room][user];
    if (data.expiredAt.isAfter(moment())) {
      return data;
    } else {
      return null;
    }
  };

  return ReviewRequests;

})();

module.exports = function() {
  return new ReviewRequests;
};

module.exports.ReviewRequests = ReviewRequests;
