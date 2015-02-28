/**
 * Created by panew on 15-2-27.
 */
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    if (req.url.indexOf('/api') > -1) {
      return res.status(403).send('forbidden!');
    }
    if (req.url.indexOf('/admin') > -1) {
      return res.redirect('/login')
    }
  }
  next();
};