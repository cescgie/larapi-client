angular.module('MyApp')
  .controller('ChatCtrl', function($scope, $auth, toastr, $stateParams, $timeout,Account, Socket, Chat) {
    $scope.data = {};
    $scope.data.message = "";
    $scope.messages = Chat.getMessages();
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 250;

    var username;

    Socket.on('connect',function(){
      Account.getProfile().then(function(response){
        username = response.data.username;
        Socket.emit('add user',username);
        Chat.setUsername(username);
      });
    });

    if($stateParams.username){
      $scope.data.message = "@" + $stateParams.username;
      document.getElementById("msg-input").focus();
    }

    var sendUpdateTyping = function(){
      if (!typing) {
        typing = true;
        Socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();
      $timeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          Socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    };

    $scope.updateTyping = function(){
      sendUpdateTyping();
    };

    $scope.messageIsMine = function(username){
      return $scope.data.username === username;
    };

    $scope.getBubbleClass = function(username){
      var classname = 'from-them';
      if($scope.messageIsMine(username)){
        classname = 'from-me';
      }
      return classname;
    };

    $scope.sendMessage = function(msg){
      Chat.sendMessage(msg);
      $scope.data.message = "";
    };

})

.controller('ChatMemberCtrl', function($scope, $auth, toastr, $stateParams, $timeout,Account, Socket, Chat, Room, User) {
  // $scope.messagedbs = [{"message":"test","username":"cescgie","timestamp":"2016-04-21 00:00:00"},{"message":"yuhu","username":"tono","timestamp":"2016-04-21 01:01:01"}];
  var roomid = $stateParams.id;
  $scope.userdata = {};
  $scope.getUserId = function(){
    var logged_uid = $auth.getPayload();
    return logged_uid.sub;
  };

  var username;
  var userid = $scope.getUserId();

  /**
  * Populate Message from database
  */
  $scope.populateMessage = function (){
    Room.getRoom(roomid)
      .then(function(response) {
        var res = JSON.parse(response.data.content);
        $scope.messagedbs = res;
        var members = JSON.parse(response.data.members);
        if (members != null && members.length > 0) {
          for (var i = 0; i < members.length; i++) {
            Account.getUser(members[i]).then(function(response,j){
              var usn = response.data.username;
              var usid = response.data.id;
              for (var j = 0; j < res.length; j++) {
                if (res[j].by==usid) {
                  res[j].username = usn;
                }
              }
            });
          }
          $scope.messagedbs = res;
        }
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
  };

  $scope.data = {};
  $scope.data.message = "";
  var typing = false;
  var lastTypingTime;
  var TYPING_TIMER_LENGTH = 250;

  $scope.connectToSocket = function (){
    Chat.setRoom(roomid);
    Account.getProfile().then(function(response){
      username = response.data.username;
      console.log('before :'+Chat.getUsername());
      Chat.setUsername(username);
      console.log('after :'+Chat.getUsername());
      Socket.emit('add user',username);
      Socket.connect();
      // Socket.on('connect',function(){
      //   console.log('connect to socket');
      // });
    });
  };

  $scope.connectToSocket();
  $scope.populateMessage();
  $scope.messages = Chat.removeMessage();
  $scope.messages = Chat.getMessages();

  var sendUpdateTyping = function(){
    if (!typing) {
      typing = true;
      Socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();
    $timeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        Socket.emit('stop typing');
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  $scope.updateTyping = function(){
    sendUpdateTyping();
  };

  $scope.messageIsMine = function(username){
    return $scope.data.username === username;
  };

  $scope.getBubbleClass = function(username){
    var classname = 'from-them';
    if($scope.messageIsMine(username)){
      classname = 'from-me';
    }
    return classname;
  };

  $scope.sendMessage = function(msg){
    Chat.sendMessage(msg,roomid);
    var newMessage = {"message":msg,"by":userid,"timestamp":Date.now()};
    var pushMessage = [];

    Room.getContent(roomid)
      .then(function(response) {
        $scope.messagedbx = JSON.parse(response.data);
        for( var i in $scope.messagedbx ) {
            pushMessage[i] = $scope.messagedbx[i];
        }
        pushMessage.push(newMessage);
        $scope.pushMessage = {};
        $scope.pushMessage.content = pushMessage;
        Room.updateRoom(roomid,$scope.pushMessage)
          .then(function(response) {
            if(response.data.status===false){
              console.log(response.data.message);
            }else{
              console.log(response.data.message);
            }
          });
      });

    //reset input
    $scope.data.message = "";
  };

  //set user to offline if leave current route(chat page)
  $scope.$on('$locationChangeStart', function() {
    Socket.disconnect();
  });

})

.controller('ChatRoomCtrl', function($scope, $auth, toastr, $stateParams, $timeout, Account, Room, ngDialog, $location) {

  $scope.getUserId = function(){
    var logged_uid = $auth.getPayload();
    return logged_uid.sub;
  };
  var userid = $scope.getUserId();
  $scope.populateChatRoom = function (){
    Account.getProfile().then(function(response){
      if(Object.keys(response.data).length !== 0){
        $scope.rooms = [];
        var my_room = JSON.parse(response.data.chat_room);
        if (my_room != null && my_room.length > 0) {
          for (var j = 0; j < my_room.length; j++) {
            Room.getRoom(my_room[j])
              .then(function(response) {
                var room_id = response.data.id;
                var res = response.data;
                var members = JSON.parse(response.data.members);
                var partner = [];
                if (members != null && members.length > 0) {
                  for (var i = 0; i < members.length; i++) {
                    if (userid!=members[i]) {
                      Account.getUser(members[i]).then(function(response){
                        var usn = response.data.username;
                        res.partner = response.data.username;
                      });
                    }
                  }
                }else{
                  Room.getRoom(room_id).then(function(response){
                    var name = response.data.name;
                    res.partner = name;
                  });
                }
                $scope.rooms.push(res);
            });
          }
        }
      }
    });
  };
  $scope.populateChatRoom();

  $scope.newGroup = function () {
     ngDialog.open({ template: 'partials/dialog/newgroup.html', className: 'ngdialog-theme-default', scope:$scope});
  };

  $scope.group = {};
  $scope.createGroup = function(){
    $scope.room = {};
    ngDialog.closeAll();
    var group = $scope.group;
    $scope.room.name = group.name;
    $scope.room.created_by = userid;
    $scope.room.userid = userid;
    $scope.room.content = [{"message":"Welcome","username":"Admin","timestamp":Date.now()}];
    Room.createNewRoom($scope.room)
      .then(function(response) {
        if(response.data.status===false){
          toastr.error(response.data.message);
        }else{
          toastr.success(response.data.message);
        }
      })
      .catch(function(resp3) {
        toastr.error(resp3.data.message, resp3.status);
      });
  };

});
