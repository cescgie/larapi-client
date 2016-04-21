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

.controller('ChatMemberCtrl', function($scope, $auth, toastr, $stateParams, $timeout,Account, Socket, Chat,Room) {
  // $scope.messagedbs = [{"message":"test","username":"cescgie","timestamp":"2016-04-21 00:00:00"},{"message":"yuhu","username":"tono","timestamp":"2016-04-21 01:01:01"}];
  var id = $stateParams.id;

  /**
  * Populate Message from database
  */
  $scope.populateMessage = function (){
    Room.getRoom(id)
      .then(function(response) {
        $scope.messagedbs = JSON.parse(response.data.content);
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
  };

  $scope.populateMessage();

  $scope.messages = Chat.getMessages();

  $scope.data = {};
  $scope.data.message = "";
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

    var newMessage = {"message":msg,"username":username,"timestamp":Date.now()};
    var pushMessage = [];

    Room.getContent(id)
      .then(function(response) {
        $scope.messagedbs = JSON.parse(response.data);
        for( var i in $scope.messagedbs ) {
            pushMessage[i] = $scope.messagedbs[i];
        }
        pushMessage.push(newMessage);
        $scope.pushMessage = {};
        $scope.pushMessage.content = pushMessage;
        console.log(pushMessage);
        Room.updateRoom(id,$scope.pushMessage)
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

});
