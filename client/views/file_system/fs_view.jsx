var FilesystemComponent = React.createClass({
  getInitialState: function() {
    return fsViewStore.getState();
  },
  componentDidMount: function() {
    eventBus.register("filesystem", function() {
      this.setState(fsViewStore.getState());
    }.bind(this));
  },
  render: function() {
    var nodes = [];
    var currentCol = [];
    for(var i=0;i<this.state.files.length;i++){
      if(i % 15 === 0){
        nodes.push(
          <div className="col">
            <ul className="collection">
              {currentCol}
            </ul>
          </div>
          )
        currentCol = [];
      }else{
        currentCol.push(<li className="collection-item"> {this.state.files[i]} </li>)
      }
    }
    if(currentCol.length > 0){
      nodes.push(
        <div className="col">
          <ul className="collection">
            {currentCol}
          </ul>
        </div>
        )
    }

    var fileData = this.state.fileData;
    return (<row>
       <h4>Filesystem</h4>
       <row>
        {nodes}
       </row>
       {fileData}
    </row>);
  }
});
