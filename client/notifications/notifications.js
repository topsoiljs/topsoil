var createNotification = function(title, options){
  return new Notification(title, options);
};
var notifications = {
  createNotification: createNotification
};
module.exports = notifications;
