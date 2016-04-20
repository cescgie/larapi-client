angular.module('MyApp')
  .factory('Room', function($http) {
    return {
      all: function(){
        return $http.get(BaseUrl+'/room');
      },
      getRoom: function(id){
        return $http.get(BaseUrl+'/room/'+id);
      },
      createNewRoom: function(dataRoom){
        return $http.post(BaseUrl+'/room', dataRoom);
      },
      updateRoom: function(id, editRoom){
        return $http.put(BaseUrl+'/room/'+id, editRoom);
      },
      removeRoom: function(id){
        return $http.delete(BaseUrl+'/room/'+id);
      }
    };
  });
