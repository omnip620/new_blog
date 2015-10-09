/**
 * Created by pzc on 15-10-9.
 */

var app = require('../../app');
var request = require('supertest')(app);
var assert = require("assert");

describe('admin articles', function () {
  describe('test index', function () {
    it('should return articles json', function () {
      request.get('/admin/articles/index')
        .expect(200, function (err, res) {
          console.log(res)
          assert.equal(1, 1);
          done(err);
        });
    });
  });
});