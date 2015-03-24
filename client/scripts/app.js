var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'react', 'socket.io-client'], function (require, exports, React, io) {
    var Output = (function (_super) {
        __extends(Output, _super);
        function Output(props) {
            _super.call(this, props);
            this.state = {
                log: []
            };
        }
        Output.prototype.setupStream = function () {
            var stream = io('http://localhost:8000');
            stream.on('data', function (data) {
                var log = this.state.log;
                this.state.log.push(data);
                this.setState({ log: log });
                var out = document.getElementById("logs");
                var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
                console.log(isScrolledToBottom);
                if (isScrolledToBottom) {
                    out.scrollTop = out.scrollHeight - out.clientHeight;
                }
            }.bind(this));
        };
        Output.prototype.componentDidMount = function () {
            this.setupStream();
        };
        Output.prototype.render = function () {
            console.log(this.state);
            var data = this.state.log.join('\n');
            return React.DOM.pre({ id: "logs" }, data);
        };
        return Output;
    })(React.Component);
    function Factory() {
        return React.createElement(Output);
    }
    React.render(Factory(), document.getElementById('output'));
});
// export = Factory;
