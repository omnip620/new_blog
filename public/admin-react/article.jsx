export default class PostForm extends React.Component {
  constructor() {
    super();
  }

  loadData() {
    $.get(this.props.url, (data)=> {
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

      this.assignData(data)
    })
  }

  saveData(data) {
    var btn = document.getElementById('submit');
    btn.setAttribute('disabled', true);
    $.ajax({
      url    : this.props.url,
      method : 'PUT',
      data   : data,
      success: ()=> {
        btn.removeAttribute('disabled');
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var o = {};

    _(this.refs).forEach((value, key) => {
      o[key] =
        this.refs[key].getDOMNode().type == "checkbox" ?
          this.refs[key].getDOMNode().checked :
          this.refs[key].getDOMNode().value;
    }).value();

    this.saveData(o)
  }

  assignData(data) {
    _(this.refs).forEach((value, key) => {
      this.refs[key].getDOMNode().type == "checkbox" ?
        this.refs[key].getDOMNode().checked = data[key] :
        this.refs[key].getDOMNode().value = data[key] || '';
    }).value();
    Materialize.updateTextFields();

    var tags = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tag'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch      : {
        cache : false,
        url   : '/api/tags/',
        filter: function (list) {
          return _.map(list, function (tag) {
            return {tag: tag.name};
          });
        }
      }
    });

    tags.initialize();

    $("#tags").materialtags({
      typeaheadjs: {
        displayName: 'tag',
        displayKey : 'tag',
        valueKey   : 'tag',
        source     : tags.ttAdapter()
      }
    });

    var myCodeMirror = CodeMirror.fromTextArea(this.refs.content.getDOMNode(), {
      lineNumbers: true,
      mode       : "gfm",
      theme      : 'default',
      extraKeys  : {
        "F11": function (cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function (cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
    });

    myCodeMirror.on('change', (instance)=> {
      this.refs.content.getDOMNode().value = instance.getValue();
    })
  }


  componentDidMount() {
    this.loadData();
    $('select').material_select();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="input-field col s12">
                <input id="title" ref="title" type="text"/>
                <label htmlFor="content">标题</label>
              </div>

              <div className="input-field col s12">
                <select className="">
                  <option value="1">生活</option>
                  <option value="2">术业</option>
                </select>
                <label htmlFor="">类型</label>

              </div>

              <div className="input-field col s12">
                <textarea id="cont" ref="content" className="materialize-textarea"></textarea>
                <label htmlFor="content">内容</label>
              </div>

              <div className="input-field col s12">
                <input id="source" type="text" ref="source"/>
                <label htmlFor="source">来源</label>
              </div>
              <div className="col s12">
                <input type="checkbox" id="top" ref="top"/>
                <label htmlFor="top">置顶</label>
              </div>

              <div className="input-field col s12">
                <input id="tags" type="text" ref="tags"/>
                <label htmlFor="tags" className="active">标签</label>
              </div>

              <div className="input-field col s12">
                <input id="views" ref="views" type="text"/>
                <label className="active" htmlFor="views">浏览量</label>
              </div>
              <div className="input-field col s12">
                <button type="submit" id="submit" className="btn btn-default right">
                  提交
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

