// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);
var localDB = new PouchDB("test");
var remoteDB = new PouchDB("http://kennith:kennith@192.168.1.79:5984/test");
app.run(function($ionicPlatform) {
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

app.controller('ctrl', function($scope){

  
    // console.log(doc.rows[0].doc.records[0].name);
    // $scope.students = [];
    // $scope.courses = [];

    $scope.applyToUi = function(){
      
      localDB.allDocs({include_docs: true, descending: true}, function(err, doc) {
          $scope.students = [];
          $scope.courses = [];
          var studentRecords = doc.rows[0].doc.records;
          var courseRecords = doc.rows[1].doc.records;

          for (var i = 0; i < studentRecords.length; i++) {
            $scope.students.push(studentRecords[i]);
          };     
          
          for (var i = 0; i < courseRecords.length; i++) {
            $scope.courses.push(courseRecords[i]);
          }
          $scope.$apply(); 
      });

    };
    $scope.applyToUi();
    

       

  

  localDB.changes({
      since: 'now',
      live: true
    }).on('change', function(change){
      console.log("Hi there");
      $scope.applyToUi();    
  });


  
});