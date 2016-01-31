/**
 * Created by pzc on 15-9-30.
 */
var cx = require('classnames');
//_id: "55e5494696dc9af130e37c65"
//cat: 2
//comment_ids: []
//comments: 0
//created_at: "2015-09-01T06:44:22.229Z"
//id: "55e5494696dc9af130e37c65"
//tags: []
//title: "基于Node的博客系统开发（1）"
//top: false
//updated_at: "2015-09-01T06:44:22.229Z"
//views: 18


class RTbody extends React.Component {
  constructor() {
    super();
    this.count = 0;
  }

  renderCheckbox(id) {
    return <div><input className="rowCheckbox" type="checkbox" id={id}/><label htmlFor={id}></label></div>
  }

  renderLink(id, title) {
    return <a href={"./article/"+id}>{title}</a>
  }

  renderCell(filed, item) {
    var text = item[filed];
    return filed == '_id' && this.renderCheckbox(text) ||
      filed == 'title' && this.renderLink(item['_id'], text) ||
      filed == 'updated_at' && moment(text).format('YYYY-MM-DD HH:mm') ||
      filed == 'tags' && text.join('，') ||
      text;
  }

  setRows(item) {
    return this.props.fileds.map((filed, j)=> {
      return (
        <td key={j}>
          {this.renderCell(filed, item)}
        </td>
      )
    })
  }

  render() {
    var itemsNode = this.props.data.map((item, i)=> {
      return (
        <tr key={i}>
          {this.setRows(item)}
        </tr>
      )
    });

    return (
      <tbody>
      {itemsNode}
      </tbody>
    )
  }
}

export class RTh extends React.Component {
  constructor() {
    super();
    this.state = {
      order: 'desc'
    }
  }

  renderCheckbox() {
    return <div><input type="checkbox" id="sa"/><label htmlFor="sa"></label></div>;
  }

  renderTH() {
    return this.props.checkbox && this.renderCheckbox() ||
      this.props.sort && (
        <div><span>{this.props.text}</span><i className={this.state.order=='desc'?'arrow_down':'arrow_up'}></i>
        </div> ) ||
      this.props.text
  }


  handleClick() {
    if (!this.props.sort) {
      return;
    }
    this.state.order = this.state.order == 'desc' ? 'asc' : 'desc';
    this.props.onSort(this.props.filed, this.state.order);
  }


  render() {
    var classes = cx({
      'sort': this.props.sort
    });
    return (
      <th className={classes}
          onClick={this.handleClick.bind(this)} width={this.props.width?this.props.width:null}>{this.renderTH()}
      </th>
    )
  }
}

class Pagelist extends React.Component {
  constructor(props) {
    super();
    this.pageCount = +props.pagecount || 7;
    this.perCount = +props.percount || 10;
    this.pageActCount = Math.ceil(this.count / this.perCount);
    this.state = {curNum: 0}
  }

  renderList() {
    this.pageActCount = Math.ceil(this.props.count / this.perCount);
    var ret = [];
    if (this.pageActCount < this.pageCount) {
      for (var i = 0, l = this.pageActCount; i < l; i++) {
        ret.push(this.renderPageBtn(i))
      }
    }
    else {
      var startpage = this.state.curNum - 3;
      var endpage = this.state.curNum + 4;
      if (startpage < 1) {
        startpage = 0;
        endpage = 7;
      }
      if (endpage > this.pageActCount) {
        endpage = this.pageActCount;
        startpage = this.pageActCount - 7;
      }
      for (var i = startpage; i < endpage; i++) {
        ret.push(this.renderPageBtn(i))
      }
    }
    return ret;
  }

  renderPageBtn(i) {
    return (
      <li key={i} className={this.state.curNum == i?'active':'waves-effect'}>
        <a href="javascript:;" onClick={this.changeCur.bind(this)} data-pagenum={i+1}>{i + 1}</a>
      </li>
    )
  }

  changeCur(e) {
    var curNum = +e.target.getAttribute('data-pagenum') - 1;
    this.setState({curNum: curNum});
    this.props.onPageData(curNum);
  }

  render() {
    return (<ul className="pagination right">
      <li className="waves-effect"><a href="javascript:;" data-pagenum='1' onClick={(e)=>{this.changeCur(e)}}>&lt;</a>
      </li>
      {this.renderList()}
      <li className="waves-effect"><a href="javascript:;" data-pagenum={this.pageActCount}
                                      onClick={(e)=>{this.changeCur(e)}}>&gt;</a></li>
    </ul>)
  }
}

export class RTable extends React.Component {
  constructor(props) {
    super();
    console.log(props)
    this.curnum = 0;
    this.filed = '';
    this.order = '';
    this.originData = '';
    this.state = {
      data  : props.data || [],
      fileds: props.fileds || []
    }
  }

  handleUserSort(filed, order) {
    this.filed = filed;
    this.order = order;
    this.renderData(this.curnum, filed, order);
  }

  handlePage(cur) {
    this.curnum = cur;
    this.renderData(cur, this.filed, this.order);
  }

  renderData(curnum, filed, order) {
    var items = _.sortByOrder(this.originData, filed = this.props.sortBy, order = this.props.order);
    items = _.take(_.slice(items, (curnum * 10)), 10);
    this.setState({data: items, fileds: _.pluck(this.props.children, 'props.filed')});
  }

  loadData(src = this.props.src) {
    $.get(src, (data)=> {
      this.originData = data;
      this.renderData(0);
    });

  }

  componentDidMount() {

    this.loadData();
    $('#sa').on('change', function () {
      var $rowsCheckbox = $('.rowCheckbox');
      $(this).is(':checked') ?
        $rowsCheckbox.prop('checked', true) :
        $rowsCheckbox.prop('checked', false)
      ;
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src == nextProps.src) {
      return;
    }
    this.loadData(nextProps.src);
    $('#sa').on('change', function () {
      var $rowsCheckbox = $('.rowCheckbox');
      $(this).is(':checked') ?
        $rowsCheckbox.prop('checked', true) :
        $rowsCheckbox.prop('checked', false)
      ;
    })
  }


  handelDel() {
    var $rowsChecedkbox = $('.rowCheckbox:checked');
    var dels = [];
    $rowsChecedkbox.each(function (key, value) {
      dels.push(value.getAttribute('id'))
    });
    $.ajax({
      url    : this.props.src,
      method : 'DELETE',
      data   : {ids: dels},
      success: ()=> this.loadData()
    });
  }


  renderDelBtn() {
    return (<a href="javascript:;" onClick={this.handelDel.bind(this)} className="btn btn-default left">删除</a>)
  }

  renderAddBtn() {
    return (<a href={this.props.add} className="waves-effect waves-light btn">新增</a>)
  }

  renderTH() {
    return React.Children.map(this.props.children, (child)=> {
      return child.type === RTh ?
        React.cloneElement(child, {onSort: this.handleUserSort.bind(this)}) :
        child;
    })
  }

  render() {
    return (
      <div className="container">
        {this.props.add && this.renderAddBtn()}
        <table className="hoverable">
          <thead>
          <tr>
            {this.renderTH()}
          </tr>
          </thead>
          <RTbody data={this.state.data} fileds={this.state.fileds}/>
        </table>
        {this.props.del && this.renderDelBtn()}
        {this.props.page &&
        <Pagelist onPageData={this.handlePage.bind(this)}
                  count={this.originData.length}
                  percount="10"
                  pagecount="7"/>}
      </div>
    )
  }
}
