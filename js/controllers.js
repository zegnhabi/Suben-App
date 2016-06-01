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
            if(name == '' || last == '' || email == '' || mobile == '' || password == '')
                deferred.reject('No dejes en blanco algún campo. Favor de verificar!');
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
            var alertPopup = $ionicPopup.alert({
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
        RegisterService.registerUser(btoa(''), btoa(''), btoa($scope.data.email), btoa($scope.data.mobile),
                                    btoa($scope.data.password), btoa(false))
        .success(function(data) {
             var alertPopup = $ionicPopup.alert({
                title: 'Register User!',
                template: data
            });
            $state.go('login');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });
    }    
})

.controller('MapCtrl', function($scope, $ionicLoading) {
    $scope.data = {};
    
    $scope.centerOnPosition = function(){
        console.log("centerOnPosition");
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: $scope.map,
                title: "My Location"
            });
        });
    };
    
    ionic.Platform.ready(function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
        
        $scope.map = map;
        
    });
});
