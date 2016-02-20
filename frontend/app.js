(function(){
  var app = angular.module('schedule', ['schedule-services', 'ngRoute', 'ngSanitize', 'ngResource']);

  app.constant('environment', 'staging');

   app.config(function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

  app.config(function($routeProvider) {
    $routeProvider
       .when('/home', {
           templateUrl: 'views/students.html',
           controller: 'Feature2Controller'
       })
       .when('/students', {
           templateUrl: 'views/students.html',
           controller: 'Feature2Controller'
       })
       .when('/TARequest', {
           templateUrl: 'views/form1.html',
           controller: 'Form1Controller'})
       .when('/ta-application', {
          templateUrl: 'views/ta-application.html',
          controller: 'TA-ApplicationController'
       })
       .otherwise({
           redirectTo: '/home'
       });
  });

app.controller('Feature2Controller',['$scope', 'Student', 'Filters', 'Application', 'jsonHandler',
  function($scope, Student, Filters, Application, jsonHandler) {
    $scope.backendStudents = [];
    $scope.applications = [];
    Student.query(function(data){
      $scope.backendStudents = data;
      Application.query(function(data){
        $scope.applications = data;

        for (var i = 0; i < $scope.backendStudents.length; i++) {
          var applications = $scope.applications.filter(function(a) {
            return a.userId == $scope.backendStudents[i].userId;
          });

          if (applications.length > 0) {
            var application = applications[0];
            $scope.backendStudents[i].hasApplied = true;
            $scope.backendStudents[i].roles = $scope.formatMajors(application.roles);
            $scope.backendStudents[i].teachers = $scope.formatMajors(application.teachers);
            $scope.backendStudents[i].notes = application.notes;
          } else {
            $scope.backendStudents[i].hasApplied = false;
          }
        }
    });
      if(data.length < 1){
        Student.query(function(atad){jsonHandler.getJson('./RealData/Student_201630.json', function(rdatar){
      jsonHandler.addAll(jsonHandler.convertJson(rdatar),function(){
        Student.query(function(data){
          $scope.backendStudents = data;
          Application.query(function(data){
        $scope.applications = data;

        for (var i = 0; i < $scope.backendStudents.length; i++) {
          var applications = $scope.applications.filter(function(a) {
            return a.userId == $scope.backendStudents[i].userId;
          });

          if (applications.length > 0) {
            var application = applications[0];
            $scope.backendStudents[i].hasApplied = true;
            $scope.backendStudents[i].roles = $scope.formatMajors(application.roles);
            $scope.backendStudents[i].teachers = $scope.formatMajors(application.teachers);
            $scope.backendStudents[i].notes = application.notes;
          } else {
            $scope.backendStudents[i].hasApplied = false;
          }
        }
    });
        });

      });
    });});
      }
    });



    

    $scope.courseFilter = Filters.getCourse();
    $scope.majorFilter = "";
    $scope.yearFilter = "";
    $scope.fundingFilter = Filters.getFunding();
    $scope.appliedFilter = Filters.getApplied();

    $scope.showMajors = function(majors) {
      var majorsToShow = [];
      for (var i = 0; i < majors.length; i++) {
        for (j = 0; j < selectedAreas.length; j++) {
          if (majors[i].indexOf(selectedAreas[j]) > -1) {
            majorsToShow.push(majors[i]);
            break;
          }
        }
      }
      return majorsToShow;
    };

    $scope.toggleSelectedArea = function (areaName) {
      var idx = $scope.selectedAreas.indexOf(areaName);
      if (idx > -1) {
        $scope.selectedAreas.splice(idx, 1);
      } else {
        $scope.selectedAreas.push(areaName);
      }
    };

    $scope.filterFunction = function(element) {
      if ($scope.filterCourse(element) &&
        $scope.filterMajor(element) &&
        $scope.filterYear(element) &&
        $scope.filterFunding(element) &&
        $scope.filterApplied(element)) {
        //$scope.filterAreas(element)) {
        return true;
      }
    return false;
    };

    $scope.filterCourse = function(element) {
      var display = false;
      for (var i = 0; i < element.courses.length; i++) {
        display = false;
        delete element.courses[i]._id;
        delete element.courses[i].name;
        if(element.courses[i].id.indexOf("CSSE") === -1 && element.courses[i].id.indexOf("MA") === -1)
        {
            element.courses.splice(i, 1);
            i--;
        }
        else if (element.courses[i].id.toLowerCase().indexOf($scope.courseFilter.toLowerCase()) > -1) {
            display = true;
        }
      }
      return display;
    };

    $scope.filterMajor = function(element) {
      if (!$scope.majorFilter)
        return true;
      for (var i = 0; i < element.majors.length; i++) {
        if (element.majors[i].toLowerCase() === $scope.majorFilter.toLowerCase()) {
          return true;
        }
      }
      return false;
    };

    $scope.filterYear = function(element) {
      if (element.startingYear.indexOf($scope.yearFilter) > -1) {
        return true;
      }
      return false;
    };

    $scope.filterFunding = function(element) {
      return !$scope.fundingFilter || element.hasWorkStudy;
    };

    $scope.formatMajors = function(majors) {
      if (majors.length === 1) {
        return majors[0];
      }
      var formattedString = majors[0];

      for (var i = 1; i < majors.length; i++) {
        formattedString += ", ";
        formattedString += majors[i];
      }
      return formattedString.substring(0,formattedString.length - 2);
    };

    $scope.filterApplied = function(element) {
      return !$scope.appliedFilter || element.hasApplied;
    };

}]).controller('Form1Controller',
  [
    '$scope',
    'TANeeds',
    'Filters',
    '$location',
    function($scope, TANeeds, Filters, $location) {

      $scope.taNeeds = [];

      TANeeds.query(function(data){
        $scope.taNeeds = data;
      });

      $scope.newNeed = {
      };

      $scope.create = function(taNeed) {
        TANeeds.save(taNeed);

        $scope.taNeeds.push(taNeed);

        $scope.newNeed = {};
      };

      $scope.update = function(taNeed) {
        TANeeds.update(taNeed);
      };

      $scope.findStudents = function(taNeed) {
        var courseId = taNeed.courseId.substring(0, taNeed.courseId.indexOf("-"));
        Filters.setCourse(courseId);
        Filters.setFunding(true);
        Filters.setApplied(true);
        $location.url('/students');
      };
    }]);

app.controller('TA-ApplicationController', ['$scope', 'Application', '$location',
  function($scope, Application, $location) {
    $scope.application = {
      userId: "",
      teachers: [],
      notes: "",
      roles: []
    };

    $scope.labAssistant = false;
    $scope.inClassAssistant = false;
    $scope.grader = false;

    $scope.hasWorkStudy = false;

    $scope.teachers = [
      "J.P. Mellor",
      "Claude Anderson",
      "Shawn Bohner",
      "Matt Boutell",
      "Steve Chenoweth",
      "Delvin Defoe",
      "Valerie Galluzzi",
      "Mark Hays",
      "Michael Hewner",
      "Cary Laxer",
      "Sriram Mohan",
      "David Mutchler",
      "Chandan Rupakheti",
      "Sid Stamm",
      "Micah Taylor",
      "Aaron Wilkin",
      "Michael Wollowski",
      "Frank H. Young"
    ];

    $scope.addApp = function(application) {
      if ($scope.labAssistant) {
        application.roles.push("Lab Assistant");
      }
      if ($scope.inClassAssistant) {
        application.roles.push("In-class Assistant");
      }
      if ($scope.grader) {
        application.roles.push("Grader");
      }
      Application.save(application);
      $location.url('/home');
    };

    $scope.toggleSelection = function toggleSelection(fruitName) {
      var idx = $scope.application.teachers.indexOf(fruitName);

      // is currently selected
      if (idx > -1) {
        $scope.application.teachers.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.application.teachers.push(fruitName);
      }
    };

  }]);

}());


