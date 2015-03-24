var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'react', 'socket.io-client'], function (require, exports, React, io) {
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(props) {
            _super.call(this, props);
        }
        Input.prototype.setupStream = function () {
            this.stream = io('http://localhost:8000');
        };
        Input.prototype.componentDidMount = function () {
            this.setupStream();
        };
        Input.prototype.handleInput = function (event) {
            if (event.type === 'keyup' && event.key === 'Enter') {
                // <HTMLInputElement> casts the HTMLElement to the HTMLInputElement type, allowing us to access the value attribute.
                var el = document.getElementById('terminal');
                var value = el.value;
                this.stream.emit('input', value);
                el.value = "";
            }
        };
        Input.prototype.render = function () {
            return React.DOM.input({ id: 'terminal', onKeyDown: this.handleInput, onKeyUp: this.handleInput.bind(this) });
        };
        return Input;
    })(React.Component);
    function Factory() {
        return React.createElement(Input);
    }
    React.render(Factory(), document.getElementById('input'));
});
// export = Factory;
