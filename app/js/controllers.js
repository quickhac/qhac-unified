'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  // see partial login.html
  controller('LoginController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
    //$scope.districts = _.map(Districts, function(district_obj) { return district_obj.name; });

    $scope.enabled = true;

    // FIXME don't hardcode this
    $scope.district = "roundrock";

    $scope.submit = function() {
      $scope.enabled = false;
      var username = $scope.username;
      var password = $scope.password;
      var district = $scope.district;
      $rootScope.gs = new GradeService(); // fixme
      console.log('GradeService instantiated');
      $rootScope.gs.ready().then(function() {
        console.log('GradeService ready');
        $rootScope.gs.attemptLogin(Districts[$scope.district], username, password).then(function(retData) {
          console.log('GradeService attempted login');
          console.dir(retData);
          if (retData.length === 1) {
            // array of students; select student
            console.log('Redirecting to /select...');
            $location.path("/select");
            $scope.$apply();
          } else {
            var grades = $rootScope.gs.getGradesYear();
            console.log('one student')
            //$location.path("/user/" + id + "/cycle/3");
          }
        }, function(e) { console.error(e); });
      }, function(e) { console.error(e); });
    };
  }])
  .controller('SelectStudentController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

    $scope.students = $rootScope.gs.newAccount.students;
    $scope.student = $scope.students[0];

    $scope.selectStudent = function() {
      // TODO
      var student = this.student;
      $rootScope.gs.attemptSelectStudent(student.studentId).spread(function(grades, student) {
        $location.path("/cycle/");
      });
    };
  }])
  // see partial cycles.html
  .controller('CycleController', ['$scope', '$routeParams', 'UserService', '$location', '$rootScope', function($scope, $routeParams, UserService, $location, $rootScope) {
    $scope.account = $rootScope.gs.getAccount();
    $scope.student = $rootScope.gs.getStudent();
    $scope.semester_index = 0;
    $scope.cycle_index = $routeParams.cycle_number || 2;
    $scope.overall_courses = $rootScope.gs.getCoursesForCycle($scope.semester_index, $scope.cycle_index);
    // $scope.course_data = {};
    // $scope.overview = UserService.getOverview($scope.user_id);
    $scope.current_course = null;
    
    // $scope.goToNextCycle = function() {
    //   var next_cycle = parseInt($scope.cycle_number) + 1;
    //   $location.path("/user/" + $scope.user_id + "/cycle/" + next_cycle);
    // };
    // $scope.goToPreviousCycle = function() {
    //   var previous_cycle = parseInt($scope.cycle_number) - 1;
    //   $location.path("/user/" + $scope.user_id + "/cycle/" + previous_cycle);
    // };

    // $scope.viewDetailed = function(course_id) {
    //   UserService.getInformationSpecificCycleCourse($scope.user_id, course_id, $scope.cycle_number, function(data) {
    //     console.log(data);
    //     console.log(course_id);
    //     $scope.course_data = data;
    //     $scope.current_course = course_id;
    //   });
    // };
    // $scope.refresh = function() {
    //   $scope.overall_courses = UserService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
    //   if($scope.current_course) {
    //     $scope.viewDetailed($scope.current_course);
    //   }
    // };
  }]);