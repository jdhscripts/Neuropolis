
  var app = angular.module('neuropolis', ['ngRoute', 'ngSanitize', 'ngResource']);

  app.constant('environment', 'staging');

   app.config(function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

  app.config(function($routeProvider) {
    $routeProvider
       .when('/loader', {
           templateUrl: 'views/loader.html',
       })
       .otherwise({
           redirectTo: '/loader'
       });
  });

