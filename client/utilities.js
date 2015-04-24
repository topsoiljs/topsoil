var keys = {
  9: 'TAB',
  40: 'DOWN_ARROW',
  38: 'UP_ARROW',
  13: 'ENTER',
  37: 'LEFT_ARROW',
  39: 'RIGHT_ARROW'
};

var isKey = function(event){
  var keycode = event.which;
  var result = false;
  for(var i=1;i<arguments.length;i++){
    result = result || keys[keycode] === arguments[i];
  }
  return result;
};

var wrapAround = function(index, length) {
  if(index < 0) {
    return length - 1; 
  } else if(index >= length) {
    return 0;
  } else {
    return index;
  }
}

exports.wrapAround = wrapAround;
exports.isKey = isKey;
