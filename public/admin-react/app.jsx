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

function Tags(){
  React.render(
    <RTable src="/api/tags" page={true} del={true}>
      <RTh filed='_id' text='' checkbox={true}/>
      <RTh sort={true} filed='name' text='标签名'/>
      <RTh sort={true} filed='count' text='文章数'/>
    </RTable>
    , document.getElementById('content'));

}
//
//React.render(
//  <PostForm url={"/api/articles/"+'55e54a5f96dc9af130e37c6c'}/>
//  , document.getElementById('content'));
page.base('/admin/react');
page('/', Articles);
page('/article/:id', Article);
page('/tags', Tags);
page();


//import {BootstrapTable, TableHeaderColumn,TableDataSet} from 'react-bootstrap-table';

//
//class Article extends React.Component {
//  render() {
//    return (
//      <div>
//        {this.props.params.articleId}
//      </div>
//    )
//  }
//}
//
//class Articles extends React.Component {
//  constructor() {
//    super();
//    this.dataSet = new TableDataSet([]);
//  }
//
//  dateFormatter(cell, row) {
//    return moment(cell).format('YYYY-MM-DD HH:mm');
//  }
//
//  titleFormatter(cell, row) {
//    return <Link to={`/article/${row._id}`}>{row.title}</Link>;
//  }
//
//
//  loadData() {
//    $.get('/api/articles', (data)=> {
//      this.dataSet.setData(data)
//    });
//  }
//
//  componentDidMount() {
//    this.loadData();
//  }
//
//  render() {
//    return (
//      <div className="container">
//        <BootstrapTable data={this.dataSet} striped={true} hover={true} pagination={true}>
//          <TableHeaderColumn dataField="title" isKey={true} dataSort={true} dataFormat={this.titleFormatter}
//                             width="20em">标题</TableHeaderColumn>
//          <TableHeaderColumn dataField="top" width="90px">置顶</TableHeaderColumn>
//          <TableHeaderColumn dataField="tags">标签</TableHeaderColumn>
//          <TableHeaderColumn dataField="views" width="90px" dataSort={true}>浏览量</TableHeaderColumn>
//          <TableHeaderColumn dataField="comments" width="90px" dataSort={true}>评论量</TableHeaderColumn>
//          <TableHeaderColumn dataField="updated_at" dataFormat={this.dateFormatter}
//                             dataSort={true}>更新日期</TableHeaderColumn>
//        </BootstrapTable>
//
//        <div className="detail">
//          {this.props.children}
//        </div>
//      </div>
//    )
//  }
//}
//
