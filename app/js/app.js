// var angular = require('angular');

// angular
//   .module('simpleWeatherApp', []);

// TODO: Move everything into the correct place

var app = angular.module('simpleWeatherApp', []);

//////////////
// Services //
//////////////
//TODO

/////////////////
// Controllers //
/////////////////
app.controller('MainController', ['$http', '$sce', '$log', function($http, $sce, $log) {
  var vm = this;
  var apiKey = 'b9a01a5d129cfc5397a97c6f6bc24292';

  vm.lat = '';
  vm.lon = '';
  vm.locationImg = '';
  vm.apiUrlCurrent = '';
  vm.apiUrlDaily = '';
  vm.dataCurrent = [];
  vm.dataDaily = [];
  vm.icon = '';
  vm.bgColour = '';

  var round = function(num) {
    // Round number up to 1 decimal places
    return Math.round(num * 10) / 10;
  };

  vm.kelvinToCelcius = function(kelvin) {
    // Convert degrees kelvin to degrees celsius
    return round(kelvin - 273.15);
  };

  vm.search = function(query) {
    $log.debug("Search fired! Pew pew!!");

    // Reset latitude value to hide geo div
    vm.lat = '';

    // Set the OpenWeatherMap API URls
    vm.apiUrlCurrent = 'http://api.openweathermap.org/data/2.5/weather?q=' + query + '&APPID=' + apiKey + '&callback=JSON_CALLBACK';
    vm.apiUrlDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + query + '&cnt=1&APPID=' + apiKey + '&callback=JSON_CALLBACK';

    // Request the actual data
    vm.weather.current();
    vm.weather.daily();
  };

  vm.getCoords = function() {
    function success(position) {
      // Set latitude and longitude
      vm.lat = position.coords.latitude;
      vm.lon = position.coords.longitude;

      // Get an image from Google Maps
      vm.locationImg = $sce.trustAsHtml('<img class="img" src="https://maps.googleapis.com/maps/api/staticmap?center=' + vm.lat + ',' + vm.lon + '&zoom=13&size=537x300&sensor=false" width="576" height="300" />');

      // Set the OpenWeatherMap API URls
      vm.apiUrlCurrent = 'http://api.openweathermap.org/data/2.5/weather?lat=' + round(vm.lat) + '&lon=' + round(vm.lon) + '&APPID=' + apiKey + '&callback=JSON_CALLBACK';
      vm.apiUrlDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + round(vm.lat) + '&lon=' + round(vm.lon) + '&cnt=1&APPID=' + apiKey + '&callback=JSON_CALLBACK';

      // Request the actual data
      vm.weather.current();
      vm.weather.daily();
    };

    function error(err) {
      $log.error("navigator.geolocation error: ", err);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  };

  vm.weather = {
    current: function() {
      $log.debug(vm.apiUrlCurrent); // Debug

      $http.jsonp(vm.apiUrlCurrent)
        .success(function(data) {
          var locationBar = angular.element(document.querySelector('#loc'));

          $log.debug("Current weather data: %O", data);
          vm.dataCurrent = data;

          // Set search/location input to show current location
          locationBar.val(vm.dataCurrent.name);

          // Show relevent icon
          vm.showIcon();
        })
        .error(function(err) {
          $log.error("$http error: ", err);
        });
    },
    daily: function() {
      $log.debug(vm.apiUrlDaily); // Debug

      $http.jsonp(vm.apiUrlDaily)
        .success(function(data) {
          $log.debug("Daily weather data: ", data);
          vm.dataDaily = data;
        })
        .error(function(err) {
          $log.error("$http error: ", err);
        });
    }
  };

  vm.showIcon = function() {
    switch (vm.dataCurrent.weather[0].icon) {
      case '01d':
        // Clear sky, day
        vm.icon = 'B';
        break;
      case '01n':
        // Clear sky, night
        vm.icon = 'C';
        break;
      case '02d':
        // Few clouds, day
        vm.icon = 'H';
        break;
      case '02n':
        // Few clouds, night
        vm.icon = 'I';
        break;
      case '03d':
      case '03n':
        // Scattered clouds
        vm.icon = 'N';
        break;
      case '04d':
      case '04n':
        // Broken clouds
        vm.icon = 'Y';
        break;
      case '09d':
      case '09n':
        // Shower rain
        vm.icon = 'R';
        break;
      case '10d':
      case '10n':
        // Rain
        vm.icon = 'Q';
        break;
      case '11d':
      case '11n':
        // Thunderstorm
        vm.icon = 'O';
        break;
      case '13d':
      case '13n':
        // Snow
        vm.icon = 'W';
        break;
      case '50d':
      case '50n':
        // Mist
        vm.icon = 'M';
        break;
      default:
        vm.icon = ')';
    };
  };

  vm.init = function () {
    // Run initial search to populate the view
    vm.search('Tokyo');
  };
}]);

