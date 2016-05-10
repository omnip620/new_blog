/**
 * Created by panew on 15-1-31.
 */

module.exports[404] = function (req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };
  res.render(viewFilePath, function (err) {
    if (err) {
      return res.json(result.status, result);
    }
    res.render(viewFilePath, {layout: false});
  });
};

module.exports[500] = function (err, req, res) {
  return res.json(500, err);
};
