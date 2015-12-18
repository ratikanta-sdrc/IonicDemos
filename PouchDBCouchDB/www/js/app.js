// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pouchApp = angular.module('starter', ['ionic']);

var localDB = new PouchDB("mytodoss");
var remoteDB = new PouchDB("http://kennith:kennith@192.168.1.79:5984/mytodoss");



pouchApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    localDB.sync(remoteDB, {live : true});
  });
});

pouchApp.controller('ctrl', function($scope, PouchDBListener, $ionicPopup){
  $scope.mytodos = [];
  $scope.create = function(){
    $ionicPopup.prompt({
      title: "Enter a new TODO item",
      inputType: "text"
    }).then(function(result){
      if(result !== ""){
         localDB.post({title: result});
      }
    });
  };

  $scope.$on("add", function(event, todo){
    console.log($scope.mytodos);
    $scope.mytodos.push(todo);
  });
  $scope.$on("delete", function(event, id){
    for (var i = 0; i < $scope.mytodos.length; i++) {
      if($scope.mytodos[i]._id === id){
        $scope.mytodos.splice(i, 1);
      }
    }
  });
});

pouchApp.factory('PouchDBListener', ['$rootScope', function($rootScope){

  localDB.changes({
    since: 'now',
    live: true
  }).on('change', function(change){
    console.log("Hi there" + change);
    if(!change.deleted){
        $rootScope.$apply(function(){
          localDB.get(change.id, function(err, doc){
            $rootScope.$apply(function(){
              if(err){
                console.log(err);
              }
              $rootScope.$broadcast("add", doc);
            });
          });
        });
    }else{
      $rootScope.$apply(function(){
          $rootScope.$broadcast("delete", change.id);
        });
    }
  });  
  

  // localDB.changes({
  //   continuous: true,
  //   onChange: function(change){
  //     if(!change.deleted){
  //       console.log("change detected!");
  //       $rootScope.$apply(function(){
  //         localDB.get(change.id, function(err, doc){
  //           $rootScope.$apply(function(){
  //             if(err){
  //               console.log(err);
  //             }
  //             $rootScope.$broadcast("add", doc);
  //           });
  //         });
  //       });
  //     }else{
  //       $rootScope.$apply(function(){
  //         $rootScope.$broadcast("delete", change.id);
  //       });
  //     }
  //   }
  // });
  return true;

}])
