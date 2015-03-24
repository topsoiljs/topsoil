import React = require('react');
import io = require('socket.io-client');

interface Props { name: string; role: string; }

interface OutputState {
  log: string[]
}

class Output extends React.Component<Props, OutputState> {
  constructor(props: Props) {
    super(props);
  }
  setupStream() {
    var stream = io('localhost:8000');
  }
  public componentDidMount() {
    this.setupStream();
  }
  public state : OutputState = {
      log: []
  }
  public render() {
    console.log(this.state);
    var data : string = this.state.log.join('\n');
    return React.DOM.pre(null, data);
  }
}

function Factory() {
  return React.createElement(Output);
}


React.render(
  Factory(),
  document.getElementById('output')
);
// export = Factory;
