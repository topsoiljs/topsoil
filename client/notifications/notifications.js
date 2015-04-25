var createNotification = function(title, options, noclose){
  var notification = new Notification(title, options);
  // Autoclose
  if(!noclose){
    setTimeout(function(){
      notification.close();
    }, 5000)
  };
  return notification;
};
var notifications = {
  createNotification: createNotification
};
module.exports = notifications;
