import React = require('react');

interface Props { name: string; role: string; }

interface OutputState {
  log: string[]
}

class Output extends React.Component<Props, OutputState> {
  constructor(props: Props) {
    super(props);
  }
  public state : OutputState = {
      log: []
  }
  public render() {
    console.log(this.state);
    // var data : string = this.state.log.join('\n');
    return React.DOM.pre(null, "testtestestst\ntestst\nasdlfjkslfd");
  }
}

function Factory() {
  return React.createElement(Output);
}

export = Factory;

React.render(
  Factory(),
  document.getElementById('output')
);
