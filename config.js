/**
 * Created by panew on 14-12-7.
 */
var config = {
  //网站运行端口
  port: 3000,
  //数据库
  db: {
    host: '127.0.0.1',
    port: '27017',
    user: '',
    pwd: '',
    database: 'blog'
  },
  //管理侧边栏
  sidebar: [
    {'文章': '/articles'},
    {'设置': '/settings'}
  ]
}
module.exports = config;