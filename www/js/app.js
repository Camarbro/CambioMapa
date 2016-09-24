// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {

  var service;
  var infoWindow;

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var userLocation =  new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    function locationController(controlDiv, map){
      //css
      var Markr = document.createElement('div');
      Markr.style.marginBottom = '50px';
      Markr.style.position = 'relative';
      controlDiv.appendChild(Markr);

      var Dot = document.createElement('div');
      Dot.style.width = '35px';
      Dot.style.height = '35px';
      Dot.style.border = '5px solid #7fd2e6';
      Dot.style.position = "relative";
      Dot.style.borderRadius = "100%"
      Markr.appendChild(Dot);

      var Pulse = document.createElement('div');
      Pulse.style.width = "20px";
      Pulse.style.height = "20px";
      Pulse.style.marginLeft = "4.5px"
      Pulse.style.marginTop = "5px"
      Pulse.style.background = "#00a6cd";
      Pulse.style.position = "relative";
      Dot.style.border = '3px solid #7fd2e6';
      Pulse.style.borderRadius = "100%"
      Dot.appendChild(Pulse);

      Markr.addEventListener('click', function(){
        $scope.map.setCenter(userLocation);
      });
    }

    var mapOptions = {
      center: userLocation,
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 20,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService($scope.map);
    $scope.map.addListener('idle', performSearch);

    function performSearch() {
      var request = {
        bounds: $scope.map.getBounds(),
        keyword: 'casa cambio'
      };
      service.radarSearch(request, callback);
    }
    function callback(results, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
      }
    }
    function addMarker(place) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: place.geometry.location,
        icon: {
          url: 'http://maps.gstatic.com/mapfiles/circle.png',
          anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(10, 17)
        }
      });

      google.maps.event.addListener(marker, 'click', function() {
        service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }
          infoWindow.setContent(result.name + result.formatted_phone_number);
          infoWindow.open($scope.map, marker);
        });
      });
    }



    $scope.marker = new google.maps.Marker({
      position: userLocation,
      icon: 'img/usr.png',
      map: $scope.map,
      title: 'You\'re here'
    }, function(err){
      console.err(err);
    });

    var requiredDIV = document.createElement('div');
    var rangeCon = new locationController(requiredDIV,$scope.map);
    requiredDIV.index = 1;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(requiredDIV);

    $scope.circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: $scope.map,
      center: userLocation,
      radius: 25
    })

  }, function(error){
    console.log("Could not get location");
  });
});
