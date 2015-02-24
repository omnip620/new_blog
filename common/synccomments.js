/**
 * Created by panew on 15-2-24.
 */


exports.index = function (req, res) {
  console.log(req.body);
  var secret = '532e232e6c639993343c09668e45b621',
    short_name = 'panblog';
     return res.json(200);
};