var SocketUrl = 'http://188.166.193.173:3000';
angular.module('MyApp')
.factory('Socket', function(socketFactory){
  var myIoSocket = io.connect(SocketUrl);
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
})

.factory('Users', function(){
    var usernames = [];
    usernames.numUsers = 0;

    return {
      getUsers: function(){
        return usernames;
      },
      addUsername: function(username){
        usernames.push(username);
      },
      deleteUsername: function(username){
        var index = usernames.indexOf(username);
        if(index != -1){
          usernames.splice(index, 1);
        }
      },
      setNumUsers: function(data){
        usernames.numUsers = data.numUsers;
      }
  };
})

.factory('Chat', function(Socket, Users){

  var username;
  var users = {};
  var timestamp;
  var room;

  users.numUsers = 0;

  var messages = [];
  var TYPING_MSG = '. . .';

  var Notification = function(username,message){
    var notification          = {};
    notification.username     = username;
    notification.message      = message;
    notification.timestamp    = Date.now();
    notification.notification = true;
    return notification;
  };

  Socket.on('login', function (data) {
    Users.setNumUsers(data);
  });

  Socket.on('new message', function(msg){
      addMessage(msg);
  });

  Socket.on('typing', function (data) {
    var typingMsg = {
      username: data.username,
      message: data.username+' is typing '+TYPING_MSG,
      timestamp:null
    };
    addMessage(typingMsg);
  });

  Socket.on('stop typing', function (data) {
    removeTypingMessage(data.username);
  });

  Socket.on('user joined', function (data) {
    var msg = data.username + ' online';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.addUsername(data.username);
  });

  Socket.on('user left', function (data) {
    var msg = data.username + ' offline';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.deleteUsername(data.username);
  });

  // var scrollBottom = function(){
  //   $ionicScrollDelegate.resize();
  //   $ionicScrollDelegate.scrollBottom(true);
  // };

  var addMessage = function(msg){
    msg.notification = msg.notification || false;
    messages.push(msg);
    // scrollBottom();
  };

  var removeTypingMessage = function(usr){
    for (var i = messages.length - 1; i >= 0; i--) {
      if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
        messages.splice(i, 1);
        // scrollBottom();
        break;
      }
    }
  };

  return {
    getUsername: function(){
      return username;
    },
    setUsername: function(usr){
      username = usr;
    },
    getMessages: function() {
      return messages;
    },
    removeMessage:function(){
      messages = [];
      return messages;
    },
    getRoom: function(){
      return room;
    },
    setRoom: function(roomid){
      room = roomid;
      Socket.emit('create', roomid);
    },
    sendMessage: function(msg,roomid){
      messages.push({
        username: username,
        message: msg,
        timestamp:Date.now()
      });
      Socket.emit('new message', msg);
    }
  };
});
