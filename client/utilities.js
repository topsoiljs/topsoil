var keys = {
  9: 'TAB',
  40: 'DOWN_ARROW',
  38: 'UP_ARROW',
  13: 'ENTER'
};

var isKey = function(event){
  var keycode = event.which;
  var result = false;
  for(var i=1;i<arguments.length;i++){
    result = result || keys[keycode] === arguments[i];
  }
  return result;
};

exports.isKey = isKey;
