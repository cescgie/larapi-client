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

});
