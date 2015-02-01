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
  //后台管理侧边栏
  sidebar: [
    {'文章': '/articles'},
    {'设置': '/settings'}
  ],
  //七牛配置
  qn:{
    ACCESS_KEY:'bwrScr6Rz9JCF5tKZMohuAbCr3VDa3attPQja-Br',
    SECRET_KEY:'qA3Vv8-k-eD_U_klbbdptAfn0BLK_VujVb4Fsldd',
    Bucket_Name:'panblog'
  },
  cat:{
    '1':'生活',
    '2':'术业'
  }
};
module.exports = config;