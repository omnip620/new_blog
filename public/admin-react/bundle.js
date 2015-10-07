/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var PostForm = __webpack_require__(1);
	var ReactTable = __webpack_require__(2);
	var RTable = ReactTable.RTable;
	var RTh = ReactTable.RTh;

	function Article(ctx) {
	  React.render(React.createElement(PostForm, { url: "/api/articles/" + ctx.params.id }), document.getElementById('content'));
	}

	function Articles() {
	  React.render(React.createElement(
	    RTable,
	    { src: '/api/articles', page: true },
	    React.createElement(RTh, { filed: '_id', text: '', checkbox: true }),
	    React.createElement(RTh, { sort: true, filed: 'title', text: '标题', width: '280px' }),
	    React.createElement(RTh, { sort: true, filed: 'source', text: '来源' }),
	    React.createElement(RTh, { filed: 'top', text: '置顶' }),
	    React.createElement(RTh, { filed: 'tags', text: '标签' }),
	    React.createElement(RTh, { sort: true, filed: 'views', text: '浏览量' }),
	    React.createElement(RTh, { filed: 'comments', text: '评论' }),
	    React.createElement(RTh, { sort: true, filed: 'updated_at', text: '更新日期' })
	  ), document.getElementById('content'));
	}

	function Tags() {
	  React.render(React.createElement(
	    RTable,
	    { src: '/api/tags', page: true, del: true },
	    React.createElement(RTh, { filed: '_id', text: '', checkbox: true }),
	    React.createElement(RTh, { sort: true, filed: 'name', text: '标签名' }),
	    React.createElement(RTh, { sort: true, filed: 'count', text: '文章数' })
	  ), document.getElementById('content'));
	}

	function ReacUnmount(ctx, next) {
	  React.unmountComponentAtNode(document.getElementById('content'));
	  next();
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PostForm = (function (_React$Component) {
	  _inherits(PostForm, _React$Component);

	  function PostForm() {
	    _classCallCheck(this, PostForm);

	    _get(Object.getPrototypeOf(PostForm.prototype), 'constructor', this).call(this);
	  }

	  _createClass(PostForm, [{
	    key: 'loadData',
	    value: function loadData() {
	      var _this = this;

	      $.get(this.props.url, function (data) {
	        //title      : {type: String},
	        //content    : {type: String},
	        //source     : {type: String},
	        //top        : {type: Boolean, default: false},
	        //created_at : {type: Date, default: Date.now},
	        //updated_at : {type: Date, default: Date.now},
	        //views      : {type: Number, default: 0},
	        //comment_ids: {type: Array, default: []},
	        //tags       : {type: Array, default: []},
	        //cat        : {type: Number}

	        _this.assignData(data);
	      });
	    }
	  }, {
	    key: 'saveData',
	    value: function saveData(data) {
	      var btn = document.getElementById('submit');
	      btn.setAttribute('disabled', true);
	      $.ajax({
	        url: this.props.url,
	        method: 'PUT',
	        data: data,
	        success: function success() {
	          btn.removeAttribute('disabled');
	        }
	      });
	    }
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(e) {
	      var _this2 = this;

	      e.preventDefault();
	      var o = {};

	      _(this.refs).forEach(function (value, key) {
	        o[key] = _this2.refs[key].getDOMNode().type == "checkbox" ? _this2.refs[key].getDOMNode().checked : _this2.refs[key].getDOMNode().value;
	      }).value();

	      this.saveData(o);
	    }
	  }, {
	    key: 'assignData',
	    value: function assignData(data) {
	      var _this3 = this;

	      _(this.refs).forEach(function (value, key) {
	        _this3.refs[key].getDOMNode().type == "checkbox" ? _this3.refs[key].getDOMNode().checked = data[key] : _this3.refs[key].getDOMNode().value = data[key] || '';
	      }).value();
	      Materialize.updateTextFields();

	      var tags = new Bloodhound({
	        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tag'),
	        queryTokenizer: Bloodhound.tokenizers.whitespace,
	        prefetch: {
	          cache: false,
	          url: '/api/tags/',
	          filter: function filter(list) {
	            return _.map(list, function (tag) {
	              return { tag: tag.name };
	            });
	          }
	        }
	      });

	      tags.initialize();

	      $("#tags").materialtags({
	        typeaheadjs: {
	          displayName: 'tag',
	          displayKey: 'tag',
	          valueKey: 'tag',
	          source: tags.ttAdapter()
	        }
	      });

	      var myCodeMirror = CodeMirror.fromTextArea(this.refs.content.getDOMNode(), {
	        lineNumbers: true,
	        mode: "gfm",
	        theme: 'default',
	        extraKeys: {
	          "F11": function F11(cm) {
	            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	          },
	          "Esc": function Esc(cm) {
	            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	          }
	        }
	      });

	      myCodeMirror.on('change', function (instance) {
	        _this3.refs.content.getDOMNode().value = instance.getValue();
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.loadData();
	      $('select').material_select();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'container' },
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'form',
	            { className: 'col s12', onSubmit: this.handleSubmit.bind(this) },
	            React.createElement(
	              'div',
	              { className: 'row' },
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement('input', { id: 'title', ref: 'title', type: 'text' }),
	                React.createElement(
	                  'label',
	                  { htmlFor: 'content' },
	                  '标题'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement(
	                  'select',
	                  { className: '' },
	                  React.createElement(
	                    'option',
	                    { value: '1' },
	                    '生活'
	                  ),
	                  React.createElement(
	                    'option',
	                    { value: '2' },
	                    '术业'
	                  )
	                ),
	                React.createElement(
	                  'label',
	                  { htmlFor: '' },
	                  '类型'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement('textarea', { id: 'cont', ref: 'content', className: 'materialize-textarea' }),
	                React.createElement(
	                  'label',
	                  { htmlFor: 'content' },
	                  '内容'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement('input', { id: 'source', type: 'text', ref: 'source' }),
	                React.createElement(
	                  'label',
	                  { htmlFor: 'source' },
	                  '来源'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'col s12' },
	                React.createElement('input', { type: 'checkbox', id: 'top', ref: 'top' }),
	                React.createElement(
	                  'label',
	                  { htmlFor: 'top' },
	                  '置顶'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement('input', { id: 'tags', type: 'text', ref: 'tags' }),
	                React.createElement(
	                  'label',
	                  { htmlFor: 'tags', className: 'active' },
	                  '标签'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement('input', { id: 'views', ref: 'views', type: 'text' }),
	                React.createElement(
	                  'label',
	                  { className: 'active', htmlFor: 'views' },
	                  '浏览量'
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'input-field col s12' },
	                React.createElement(
	                  'button',
	                  { type: 'submit', id: 'submit', className: 'btn btn-default right' },
	                  '提交'
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return PostForm;
	})(React.Component);

	exports['default'] = PostForm;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by pzc on 15-9-30.
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var cx = __webpack_require__(3);
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

	var RTbody = (function (_React$Component) {
	  _inherits(RTbody, _React$Component);

	  function RTbody() {
	    _classCallCheck(this, RTbody);

	    _get(Object.getPrototypeOf(RTbody.prototype), "constructor", this).call(this);
	    this.count = 0;
	  }

	  _createClass(RTbody, [{
	    key: "renderCheckbox",
	    value: function renderCheckbox(id) {
	      return React.createElement(
	        "div",
	        null,
	        React.createElement("input", { className: "rowCheckbox", type: "checkbox", id: id }),
	        React.createElement("label", { htmlFor: id })
	      );
	    }
	  }, {
	    key: "renderLink",
	    value: function renderLink(id, title) {
	      return React.createElement(
	        "a",
	        { href: "./article/" + id },
	        title
	      );
	    }
	  }, {
	    key: "renderCell",
	    value: function renderCell(filed, item) {
	      var text = item[filed];
	      return filed == '_id' && this.renderCheckbox(text) || filed == 'title' && this.renderLink(item['_id'], text) || filed == 'updated_at' && moment(text).format('YYYY-MM-DD HH:mm') || filed == 'tags' && text.join('，') || text;
	    }
	  }, {
	    key: "setRows",
	    value: function setRows(item) {
	      var _this = this;

	      return this.props.fileds.map(function (filed, j) {
	        return React.createElement(
	          "td",
	          { key: j },
	          _this.renderCell(filed, item)
	        );
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this2 = this;

	      var itemsNode = this.props.data.map(function (item, i) {
	        return React.createElement(
	          "tr",
	          { key: i },
	          _this2.setRows(item)
	        );
	      });

	      return React.createElement(
	        "tbody",
	        null,
	        itemsNode
	      );
	    }
	  }]);

	  return RTbody;
	})(React.Component);

	var RTh = (function (_React$Component2) {
	  _inherits(RTh, _React$Component2);

	  function RTh() {
	    _classCallCheck(this, RTh);

	    _get(Object.getPrototypeOf(RTh.prototype), "constructor", this).call(this);
	    this.state = {
	      order: 'desc'
	    };
	  }

	  _createClass(RTh, [{
	    key: "renderCheckbox",
	    value: function renderCheckbox() {
	      return React.createElement(
	        "div",
	        null,
	        React.createElement("input", { type: "checkbox", id: "sa" }),
	        React.createElement("label", { htmlFor: "sa" })
	      );
	    }
	  }, {
	    key: "renderTH",
	    value: function renderTH() {
	      return this.props.checkbox && this.renderCheckbox() || this.props.sort && React.createElement(
	        "div",
	        null,
	        React.createElement(
	          "span",
	          null,
	          this.props.text
	        ),
	        React.createElement("i", { className: this.state.order == 'desc' ? 'arrow_down' : 'arrow_up' })
	      ) || this.props.text;
	    }
	  }, {
	    key: "handleClick",
	    value: function handleClick() {
	      if (!this.props.sort) {
	        return;
	      }
	      this.state.order = this.state.order == 'desc' ? 'asc' : 'desc';
	      this.props.onSort(this.props.filed, this.state.order);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var classes = cx({
	        'sort': this.props.sort
	      });
	      return React.createElement(
	        "th",
	        { className: classes,
	          onClick: this.handleClick.bind(this), width: this.props.width ? this.props.width : null },
	        this.renderTH()
	      );
	    }
	  }]);

	  return RTh;
	})(React.Component);

	exports.RTh = RTh;

	var Pagelist = (function (_React$Component3) {
	  _inherits(Pagelist, _React$Component3);

	  function Pagelist(props) {
	    _classCallCheck(this, Pagelist);

	    _get(Object.getPrototypeOf(Pagelist.prototype), "constructor", this).call(this);
	    this.pageCount = +props.pagecount || 7;
	    this.perCount = +props.percount || 10;
	    this.pageActCount = Math.ceil(this.count / this.perCount);
	    this.state = { curNum: 0 };
	  }

	  _createClass(Pagelist, [{
	    key: "renderList",
	    value: function renderList() {
	      this.pageActCount = Math.ceil(this.props.count / this.perCount);
	      var ret = [];
	      if (this.pageActCount < this.pageCount) {
	        for (var i = 0, l = this.pageActCount; i < l; i++) {
	          ret.push(this.renderPageBtn(i));
	        }
	      } else {
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
	          ret.push(this.renderPageBtn(i));
	        }
	      }
	      return ret;
	    }
	  }, {
	    key: "renderPageBtn",
	    value: function renderPageBtn(i) {
	      return React.createElement(
	        "li",
	        { key: i, className: this.state.curNum == i ? 'active' : 'waves-effect' },
	        React.createElement(
	          "a",
	          { href: "javascript:;", onClick: this.changeCur.bind(this), "data-pagenum": i + 1 },
	          i + 1
	        )
	      );
	    }
	  }, {
	    key: "changeCur",
	    value: function changeCur(e) {
	      var curNum = +e.target.getAttribute('data-pagenum') - 1;
	      this.setState({ curNum: curNum });
	      this.props.onPageData(curNum);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this3 = this;

	      return React.createElement(
	        "ul",
	        { className: "pagination right" },
	        React.createElement(
	          "li",
	          { className: "waves-effect" },
	          React.createElement(
	            "a",
	            { href: "javascript:;", "data-pagenum": "1", onClick: function (e) {
	                _this3.changeCur(e);
	              } },
	            "<"
	          )
	        ),
	        this.renderList(),
	        React.createElement(
	          "li",
	          { className: "waves-effect" },
	          React.createElement(
	            "a",
	            { href: "javascript:;", "data-pagenum": this.pageActCount,
	              onClick: function (e) {
	                _this3.changeCur(e);
	              } },
	            ">"
	          )
	        )
	      );
	    }
	  }]);

	  return Pagelist;
	})(React.Component);

	var RTable = (function (_React$Component4) {
	  _inherits(RTable, _React$Component4);

	  function RTable(props) {
	    _classCallCheck(this, RTable);

	    _get(Object.getPrototypeOf(RTable.prototype), "constructor", this).call(this);
	    this.curnum = 0;
	    this.filed = '';
	    this.order = '';
	    this.originData = '';
	    this.state = {
	      data: props.data || [],
	      fileds: props.fileds || []

	    };
	  }

	  _createClass(RTable, [{
	    key: "handleUserSort",
	    value: function handleUserSort(filed, order) {
	      this.filed = filed;
	      this.order = order;
	      this.renderData(this.curnum, filed, order);
	    }
	  }, {
	    key: "handlePage",
	    value: function handlePage(cur) {
	      this.curnum = cur;
	      this.renderData(cur, this.filed, this.order);
	    }
	  }, {
	    key: "renderData",
	    value: function renderData(curnum, filed, order) {
	      var items = _.sortByOrder(this.originData, filed, order);
	      items = _.take(_.slice(items, curnum * 10), 10);
	      this.setState({ data: items, fileds: _.pluck(this.props.children, 'props.filed') });
	    }
	  }, {
	    key: "loadData",
	    value: function loadData() {
	      var _this4 = this;

	      var src = arguments.length <= 0 || arguments[0] === undefined ? this.props.src : arguments[0];

	      $.get(src, function (data) {
	        _this4.originData = data;

	        _this4.renderData(0);
	      });
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this.loadData();
	      $('#sa').on('change', function () {
	        var $rowsCheckbox = $('.rowCheckbox');
	        $(this).is(':checked') ? $rowsCheckbox.prop('checked', true) : $rowsCheckbox.prop('checked', false);
	      });
	    }
	  }, {
	    key: "componentWillReceiveProps",
	    value: function componentWillReceiveProps(nextProps) {
	      if (this.props.src == nextProps.src) {
	        return;
	      }
	      this.loadData(nextProps.src);
	      $('#sa').on('change', function () {
	        var $rowsCheckbox = $('.rowCheckbox');
	        $(this).is(':checked') ? $rowsCheckbox.prop('checked', true) : $rowsCheckbox.prop('checked', false);
	      });
	    }
	  }, {
	    key: "handelDel",
	    value: function handelDel() {
	      var _this5 = this;

	      var $rowsChecedkbox = $('.rowCheckbox:checked');
	      var dels = [];
	      $rowsChecedkbox.each(function (key, value) {
	        dels.push(value.getAttribute('id'));
	      });
	      $.ajax({
	        url: this.props.src,
	        method: 'DELETE',
	        data: { ids: dels },
	        success: function success() {
	          _this5.loadData();
	        }
	      });
	    }
	  }, {
	    key: "renderDelBtn",
	    value: function renderDelBtn() {
	      return React.createElement(
	        "a",
	        { href: "javascript:;", onClick: this.handelDel.bind(this), className: "btn btn-default left" },
	        "删除"
	      );
	    }
	  }, {
	    key: "renderTH",
	    value: function renderTH() {
	      var _this6 = this;

	      return React.Children.map(this.props.children, function (child) {
	        return child.type === RTh ? React.cloneElement(child, { onSort: _this6.handleUserSort.bind(_this6) }) : child;
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "div",
	        { className: "container" },
	        React.createElement(
	          "table",
	          { className: "hoverable" },
	          React.createElement(
	            "thead",
	            null,
	            React.createElement(
	              "tr",
	              null,
	              this.renderTH()
	            )
	          ),
	          React.createElement(RTbody, { data: this.state.data, fileds: this.state.fileds })
	        ),
	        this.props.del && this.renderDelBtn(),
	        this.props.page && React.createElement(Pagelist, { onPageData: this.handlePage.bind(this),
	          count: this.originData.length,
	          percount: "10",
	          pagecount: "7" })
	      );
	    }
	  }]);

	  return RTable;
	})(React.Component);

	exports.RTable = RTable;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	(function () {
		'use strict';

		function classNames () {

			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if ('string' === argType || 'number' === argType) {
					classes += ' ' + arg;

				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);

				} else if ('object' === argType) {
					for (var key in arg) {
						if (arg.hasOwnProperty(key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}

			return classes.substr(1);
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true){
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}

	}());


/***/ }
/******/ ]);