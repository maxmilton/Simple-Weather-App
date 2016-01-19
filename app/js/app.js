angular
  .module('simpleWeatherApp', []);

////////////////
// Controller //
////////////////
(function() {
  'use strict';

  angular
    .module('simpleWeatherApp')
    .controller('MainController', ['$http', '$sce', '$log', function($http, $sce, $log) {
      // Declate all the private variables
      var vm = this;
      var _currentLocation = '';
      var _apiKey = 'b9a01a5d129cfc5397a97c6f6bc24292';
      var _apiUrlCurrent = '';
      var _apiUrlDaily = '';

      // Declate the controllers public API
      vm.cardColour = 'orange';
      vm.searchBox = '';
      vm.lat = '';
      vm.lon = '';
      vm.locationImg = '';
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
        // Reset latitude value to hide geo div
        vm.lat = '';

        // Set the OpenWeatherMap API URls
        _apiUrlCurrent = 'http://api.openweathermap.org/data/2.5/weather?q=' + query + '&APPID=' + _apiKey + '&callback=JSON_CALLBACK';
        _apiUrlDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + query + '&cnt=1&APPID=' + _apiKey + '&callback=JSON_CALLBACK';

        // Request the actual data
        vm.weather.current();
        vm.weather.daily();
      };

      vm.getCoords = function() {
        // Use the browser build in geolocation feature
        navigator.geolocation.getCurrentPosition(success, error);

        function success(position) {
          // Set latitude and longitude
          vm.lat = position.coords.latitude;
          vm.lon = position.coords.longitude;

          // Get an image from Google Maps
          vm.locationImg = $sce.trustAsHtml('<img class="img" src="https://maps.googleapis.com/maps/api/staticmap?center=' + vm.lat + ',' + vm.lon + '&zoom=13&size=537x300&sensor=false" width="576" height="300" />');

          // Set the OpenWeatherMap API URls
          _apiUrlCurrent = 'http://api.openweathermap.org/data/2.5/weather?lat=' + round(vm.lat) + '&lon=' + round(vm.lon) + '&APPID=' + _apiKey + '&callback=JSON_CALLBACK';
          _apiUrlDaily = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + round(vm.lat) + '&lon=' + round(vm.lon) + '&cnt=1&APPID=' + _apiKey + '&callback=JSON_CALLBACK';

          // Once we have the location request the wather data
          vm.weather.current();
          vm.weather.daily();
        };

        function error(err) {
          $log.error("navigator.geolocation error: ", err);
        };
      };

      vm.weather = {
        current: function() {
          // Do a JSONP AJAX request to get current weather data
          $http.jsonp(_apiUrlCurrent)
            .success(function(data) {

              // $log.debug("Current weather data: %O", data);
              vm.dataCurrent = data;

              // Set search/location input to show current location
              vm.searchBox = vm.dataCurrent.name;

              // Show relevent icon
              vm.showIcon();
            })
            .error(function(err) {
              $log.error("$http error: ", err);
            });
        },
        daily: function() {
          // Do a JSONP AJAX request to get daily weather data
          $http.jsonp(_apiUrlDaily)
            .success(function(data) {
              // $log.debug("Daily weather data: ", data);
              vm.dataDaily = data;
            })
            .error(function(err) {
              $log.error("$http error: ", err);
            });
        }
      };

      vm.showIcon = function() {
        // Choose the corisponding icon font letter to the correct weather type
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
            // Declate all the private variables
            vm.icon = ')';
        };
      };

      vm.changeColour = function (color) {
        // Change the colour of the .card CSS cl
              // Declate the controllers public APIass
        vm.cardColour = color;
      };

      vm.searchClick = function() {
        // Clear the contents of the search box but save the previous contents
        _currentLocation = vm.searchBox;
        vm.searchBox = '';
      };

      vm.searchBlur = function() {
        // If the user didn't type a location restore the previous one
        if (vm.searchBox === '') {
          vm.searchBox = _currentLocation;
        };
      };

      vm.init = function () {
        // Bunch of cityes for random selection
        var cities = [
          'Sydney',
          'Melbourne',
          'Tokyo',
          'Osaka',
          'London',
          'Berlin',
          'Antarctica'
        ];

        // Generate a random number up to the array size
        var random = Math.floor(Math.random() * cities.length);

        // Run initial search to populate the view
        vm.search(cities[random]);
      };
    }]);
})();
