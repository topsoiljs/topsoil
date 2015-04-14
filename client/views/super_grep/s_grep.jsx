var grepStore = GrepStore();

var SGrepComponent = React.createClass({
  getInitialState: function() {
    return grepStore.getState();
  },
  selectCallback: function(e) {
    //Should probs have a open file component.
    grepStore._setFile(e.target.value);
  },
  componentDidMount: function() {
    eventBus.register("s_grep", function() {
      this.setState(grepStore.getState());
    }.bind(this));
  },
  render: function() {
    var activeRegexName = this.state.activeRegex;
    var activeRegex = this.state.regex[activeRegexName];
    var selection;

    if(activeRegex) {
      selection = activeRegex.selection;
    }

    return (
      <div>
        SUPER GREP
        <div className="row">
          <SGrepEditor regex={selection}/>
          <p>
            Current Directory: {this.state.dir}
          </p>
          <select onChange={this.selectCallback} className="browser-default">
            {
              this.state.files.map(function(file) {
                return (<option value={file}>{file}</option>);
              })
            }
          </select>
          <FileViewer activeFile={this.state.activeFile} file={this.state.file}/>
          <GrepResults results={this.state.results}/>
        </div>
      </div>
    );
  }
});


magic.registerView({
  name: 'super grep',
  commands: [
    {
      name: "setDirectory",
      description: "sets the directory for the super grep view",
      args: ['path'],
      tags: ["set dir", "folder", "current dir"],
      categories: ['set'],
      method: grepStore['setDir']
    }
  ],
  category: 'filesystem',
  component: SGrepComponent
});
