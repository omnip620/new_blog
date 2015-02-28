/**
 * Created by panew on 15-2-27.
 */
exports.userRequired = function (req, res,next) {
  if (!req.session || !req.session.user) {
    return res.status(403).send('forbidden!');
  }
  console.log(req.session,req.session.user);
  next();
};