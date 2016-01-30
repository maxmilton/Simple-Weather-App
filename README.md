A simple experiment using AngularJS, the OpenWeatherMap API, and CSS3.

# Overview

Mostly just a project to allow me to experiment with AngularJS. View a live version at https://labs.wearegenki.com/experiments/simple-weather-app/

Source code available on [Github](https://github.com/MaxMilton/Simple-Weather-App).

## Interesting Points

* Gets weather via the OpenWeatherMap API using JSONP requests.
* Uses browser built in geolocation to get coordinates.
* CSS3 animations on colour change and location panel appearing.
* Shows weather from a random city on page load and button.
* Able to run on https even though OpenWeatherMap is http only by using a proxy

## Development Instructions

1. Watch SCSS for changes: `npm run-script watch`
2. Start the local web server: `npm start`
3. Open a new browser tab and go to: http://localhost:8880/

## Made Using

* Weather Icons - http://www.alessioatzeni.com/meteocons/
* OpenWeatherMap API - http://openweathermap.org/api
* Normalize.css - https://necolas.github.io/normalize.css/
