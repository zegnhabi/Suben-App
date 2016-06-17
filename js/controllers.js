angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.service('LoginService', function($http, $q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // Simple GET request example:
            $http({
              method: 'POST',
              url: 'http://vergui.xyz:8080/login',
              data: {email: name, password: pw}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if(response.data && response.data.error){
                  deferred.reject(response.data.message);
                }else{
                  deferred.resolve('Welcome ' + name + '!');
                }
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject('inicio de sesión incorrecto, verifique.');
              });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('RegisterService', function($http, $q) {
    return {
        registerUser: function(name, last, email, mobile, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
              method: 'POST',
              url: 'http://vergui.xyz:8080/users',
              data: {name: name, last: last, email: email, mobile: mobile, password: password, driver: false, photo: ''}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if(response.data && response.data.error){
                  deferred.reject(response.data.message);
                }else{
                  deferred.resolve(response.data.message);
                }
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(response.data.message);
              });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser(btoa($scope.data.email), btoa($scope.data.password)).success(function(data) {
            $state.go('app.map');
        }).error(function(data) {
            $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });
    }
})

.controller('MainCtrl', function($scope) {})

.controller('RegisterCtrl', function($scope, RegisterService, $ionicPopup, $state){
    $scope.data = {};
    
    $scope.registerUser = function() {
        if($scope.data.email == '' || $scope.data.email == undefined 
            || $scope.data.mobile == '' || $scope.data.mobile == undefined 
            || $scope.data.password == '' || $scope.data.password == undefined){
            $ionicPopup.alert({
                title: 'Register User!',
                template: 'No dejes en blanco algún campo. Favor de verificar!'
            });
            return;
        }
        RegisterService.registerUser(btoa($scope.data.name), btoa($scope.data.last), btoa($scope.data.email),
         btoa($scope.data.mobile), btoa($scope.data.password), false)
        .success(function(data) {
            $ionicPopup.alert({
                title: 'Register User!',
                template: data
            });
            $state.go('login');
        }).error(function(data) {
            $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });
    }    
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {

    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.latLng = latLng;
    }, function(error){
            console.log("Could not get location");
    }).then(function(){
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){    
            var innerLocation = new google.maps.Circle({
                strokeColor: '#005ce6',
                strokeOpacity: 1,
                strokeWeight: 1.5,
                fillColor: '#005ce6',
                fillOpacity: 1,
                map: $scope.map,
                center: $scope.latLng,
                radius: 10
            });
            var currentLocation = new google.maps.Circle({
                strokeColor: '#1a75ff',
                strokeOpacity: 0.5,
                strokeWeight: 0.5,
                fillColor: '#1a75ff',
                fillOpacity: 0.5,
                map: $scope.map,
                center: $scope.latLng,
                radius: 40
            });
        });
    }); 
});
