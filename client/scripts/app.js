var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'react'], function (require, exports, React) {
    var Output = (function (_super) {
        __extends(Output, _super);
        function Output(props) {
            _super.call(this, props);
            this.state = {
                log: []
            };
        }
        Output.prototype.setupStream = function () {
        };
        Output.prototype.componentDidMount = function () {
            this.setupStream();
        };
        Output.prototype.render = function () {
            console.log(this.state);
            var data = this.state.log.join('\n');
            return React.DOM.pre(null, data);
        };
        return Output;
    })(React.Component);
    function Factory() {
        return React.createElement(Output);
    }
    React.render(Factory(), document.getElementById('output'));
});
// export = Factory;
