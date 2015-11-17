
module.exports = function(arg) {
  var pr, robot;
  pr = arg.pr, robot = arg.robot;
  robot.hear(/^y(?:es)?$/i, function(res) {
    return pr.merge(res);
  });
  return robot.hear(/^n(?:o)?$/i, function(res) {
    return pr.cancel(res);
  });
};
