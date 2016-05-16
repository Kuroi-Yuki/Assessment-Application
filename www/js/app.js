// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'pdf'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
 
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
$ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup other states
  .state('main', {
    url: '/main',
          cache: false,
    abstract: true,
    templateUrl: 'templates/main.html'
  })

  // setup concrete states
  .state('main.login', {
    url: '/login',
      cache: false,
    views: {
      'main-login': {
        templateUrl: 'templates/main-login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('main.loadstudentquestions', {
    url: '/loadstudentquestions',
      cache: false,
    views: {
      'main-loadstudentquestions': {
        templateUrl: 'templates/main-loadstudentquestions.html',
        controller: 'LoadStudentQuestionsCtrl'
      }
    }
  })

  .state('main.studentquestions', {
    url: '/studentquestions',
      cache: false,
    views: {
      'main-studentquestions': {
        templateUrl: 'templates/main-studentquestions.html',
        controller: 'StudentQuestionsCtrl'
      }
    }
  })

  .state('main.teacher', {
    url: '/teacher',
      cache: false,
    views: {
      'main-teacher': {
        templateUrl: 'templates/main-teacher.html',
        controller: 'TeacherCtrl'
      }
    }
  })

  .state('main.teacherquestions', {
    url: '/teacherquestions',
      cache: false,
    views: {
      'main-teacherquestions': {
        templateUrl: 'templates/main-teacherquestions.html',
        controller: 'TeacherQuestionsCtrl'
      }
    }
  })
/*
  .state('main.reports', {
    url: '/reports',
      cache: false,
    views: {
      'main-reports': {
        templateUrl: 'templates/main-reports.html',
        controller: 'DocumentController'
      }
    }
  })*/

  .state('main.score', {
    url: '/score',
      cache: false,
    views: {
      'main-score': {
        templateUrl: 'templates/main-score.html',
        controller: 'ScoreCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/login');

});
