var PostForm = require('./article.jsx');
var ReactTable = require('./react-table.jsx');
var RTable = ReactTable.RTable;
var RTh = ReactTable.RTh;


function Article(ctx) {
  React.render(
    <PostForm url={"/api/articles/"+ctx.params.id}/>
    , document.getElementById('content'));
}

function Articles() {
  React.render(
    <RTable src="/api/articles" page={true}>
      <RTh filed='_id' text='' checkbox={true}/>
      <RTh sort={true} filed='title' text='标题' width="280px"/>
      <RTh sort={true} filed='source' text='来源'/>
      <RTh filed='top' text='置顶'/>
      <RTh filed='tags' text='标签'/>
      <RTh sort={true} filed='views' text='浏览量'/>
      <RTh filed='comments' text='评论'/>
      <RTh sort={true} filed='updated_at' text='更新日期'/>
    </RTable>
    , document.getElementById('content'));
}

function Tags() {
  React.render(
    <RTable src="/api/tags" page={true} del={true}>
      <RTh filed='_id' text='' checkbox={true}/>
      <RTh sort={true} filed='name' text='标签名'/>
      <RTh sort={true} filed='count' text='文章数'/>
    </RTable>
    , document.getElementById('content'));

}

function ReacUnmount(ctx, next) {
  React.unmountComponentAtNode(document.getElementById('content'));
  next()
}

//
//React.render(
//  <PostForm url={"/api/articles/"+'55e54a5f96dc9af130e37c6c'}/>
//  , document.getElementById('content'));
page.base('/admin/react');
page('*', ReacUnmount);

page('/', Articles);
page('/article/:id', Article);
page('/tags', Tags);

page();

