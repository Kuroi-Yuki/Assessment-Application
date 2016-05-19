angular.module('starter.controllers', [])

/********************************************** Student's Questions Loading view Controller **********************************************/
.controller('LoadStudentQuestionsCtrl', function($scope, $state, $users, $mqtt, $questions) {
  //
  $scope.startQuiz = function(){
    $questions.setquestions($mqtt.getmessage());
    console.log($questions.all());

    $state.go('main.studentquestions'); 
  }
})

/****************************************************** Login view Controller ******************************************************/
.controller('LoginCtrl', function($scope, $state, $users, $mqtt, $questions) {
  //Get all entries via NodeJS from CouchDB to do authentication
  $users.getAll();

  //When login is pressed, this function is called, which will do the 
  //authentication and direct the user to a view based on their role
  $scope.login = function(username, password) {
    $scope.msg = {}; //To store the msg to be published
    var check = $users.authenticate(username, password);

    //check if a registered user and based on the role do something
    if (check === true && $users.getCurrentrole() === "student")
    {console.log( $users.getCurrentrole());

      //initialize connecttion to MQTT broker
      $mqtt.init($users.getCurrentclass(), $users.getCurrentrole());

      //Go to the view that has the first question
      $state.go('main.loadstudentquestions'); 
    } 

    else if (check === true && $users.getCurrentrole() === "teacher") //or admin??
    {
      //initialize connection to MQTT broker
      $mqtt.init($users.getCurrentclass(), $users.getCurrentrole());

      //Go to the Teacher's view that has the first question
      $state.go('main.teacher'); 
    }

    else
    {
      //Wrong ID or password
      $scope.msg = {text: "Incorrect username or password"}
    }

  };
})

/***************************************************** Student's Questions view Controller *****************************************************/
.controller('StudentQuestionsCtrl', function($scope, $state, $http, $questions, $score, $users, $mqtt, $HardwareBackButtonManager, $context, $interval) {
  $HardwareBackButtonManager.disable();
  $scope.index = 0;
  $scope.Answers = {}; //will have the students answers
  var score = 0;
  todisplay = [];
  console.log(todisplay);

  //has the questions and right answers
  $scope.Questions = $questions.all();
  console.log($scope.Questions);
  var start = new Date().getTime();
  var end = 0;
  var timeinterval = 0;
  var store = {};
  var geolocation ={};
  var shake = 0;

  geolocation = $context.getlocation();
  shake = $context.getAcceleration();
  var illuminance=0;
  var THI = 0;
  /* $scope.illuminance= $context.getSensorData("LIGHT"); */
  var humidity=0;
  /* $scope.humidity= $context.getSensorData("RELATIVE_HUMIDITY"); */
  var temp=0;
  /* $scope.temp= $context.getSensorData("AMBIENT_TEMPERATURE"); */
/*  var shaking=0;
*/  /* $scope.THI= $context.getTHI(); */


/////////////////////////////////////////////////////////////////////////

  var C1 = -42.379;
  var C2 = 2.04901523;
  var C3 = 10.14333127;
  var C4 = -0.22475541;
  var C5 = -.00683783;
  var C6 = -5.481717E-2;
  var C7 = 1.22874E-3;
  var C8 = 8.5282E-4;
  var C9 = -1.99E-6;
  var T = 32 + (temp * 9 / 5);
  var R = humidity;
  var T2 = T * T;
  var R2 = humidity * humidity;

////////////////////////////////////////////////////////////////////////

  function onSuccess(values){
  illuminance = values[0];
/*  $scope.humidity= values[1];
  $scope.temp=values[2]; */
  THI = C1 + (C2 * T) + (C3 * R) + (C4 * T * R) + (C5 * T2) + (C6 * R2) + (C7 * T2 * R) + (C8 * T * R2) + (C9 * T2 * R2);

}

document.addEventListener("deviceready", function () {
sensors.enableSensor("LIGHT");
sensors.enableSensor("RELATIVE_HUMIDITY");
sensors.enableSensor("AMBIENT_TEMPERATURE");
}, false);

$interval(function(){
sensors.getState(onSuccess);
}, 100);
  
  $scope.nextQuestion = function() {
    end = new Date().getTime();

    //in seconds
    timeinterval = (end - start)/1000;

  todisplay[$scope.index] = {q:$scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].prompt,
  a: $scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].simpleChoice,
    sa:$scope.Answers[$scope.Questions[$scope.index].assessmentItem[0]._identifier]};
    //Set questions ID
    //var quizID = "100"; //set it in the coming quiz json
    var curriculum = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].ID;
    var grade = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Grade;
    var subject = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Subject;
    var unit = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Unit;
    var topic = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Topic;
    var slo = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].LO;
    store.qID = curriculum + "_" + grade + "_" + subject + "_" + unit + "_" + topic + "_" + slo + "_" +  $scope.Questions[$scope.index].assessmentItem[0]._identifier;
    console.log(curriculum);
    console.log(store.qID);

    store.questionID = $scope.Questions[$scope.index].assessmentItem[0]._identifier;
    if($scope.Answers[$scope.Questions[$scope.index].assessmentItem[0]._identifier] === $scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].simpleChoice)
    {
      store.status = "correct";
      score++;
      $score.updateScore(score);
    }
    else
    {
      store.status = "incorrect";
    }
    store.username = $users.getCurrentusername();
    store.duration = timeinterval;
    store.timestamp = Date();
    store.context = {light:illuminance,heatindex:THI,shaking:shake,alt:geolocation.Alt,long:geolocation.Long};

    console.log(store);

    //mqtt publish
    $mqtt.publish(JSON.stringify(store), "newAttempt", 1);    

    start = new Date().getTime()
    return $questions.checkindex($scope.index++);
  }

  $scope.submitAnswers = function() {

    end = new Date().getTime();

    //in seconds
    timeinterval = (end - start)/1000;

    todisplay[$scope.index] = {q:$scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].prompt,
    a: $scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].simpleChoice,
    sa:$scope.Answers[$scope.Questions[$scope.index].assessmentItem[0]._identifier]};

//Set questions ID
    var curriculum = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].ID;
    var grade = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Grade;
    var subject = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Subject;
    var unit = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Unit;
    var topic = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].Topic;
    var slo = $scope.Questions[$scope.index].assessmentItem[0].Curriculum[0].LO;
    store.qID = curriculum + "_" + grade + "_" + subject + "_" + unit + "_" + topic + "_" + slo + "_" +  $scope.Questions[$scope.index].assessmentItem[0]._identifier;

    store.questionID = $scope.Questions[$scope.index].assessmentItem[0]._identifier;
    if($scope.Answers[$scope.Questions[$scope.index].assessmentItem[0]._identifier] === $scope.Questions[$scope.index].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].simpleChoice)
    {
      store.status = "correct";
      score++;
      $score.updateScore(score);
    }
    else
    {
      store.status = "incorrect";
    }
    store.username = $users.getCurrentusername();
    store.duration = timeinterval;
    store.timestamp = Date();
    store.context = {light:illuminance,heatindex:THI,shaking:shake,alt:geolocation.Alt,long:geolocation.Long};

    //mqtt publish
    $mqtt.publish(JSON.stringify(store), "newAttempt", 1);

    $score.setDisplay(todisplay);

 //go to the score view
 $state.go('main.score'); 
}
})

/****************************************************** Student's Questions view Controller ******************************************************/
.controller('ScoreCtrl', function($scope, $score,$mqtt,$state, $users, $HardwareBackButtonManager) {
  $HardwareBackButtonManager.disable();
  $scope.score = $score.getScore();
  $scope.display = $score.getDisplay();

  $scope.logout = function(){
    $mqtt.unsubscribe($users.getCurrentclass());
    $users.setCurrentusername("");
    $users.setCurrentrole("");
    $users.setCurrentclass("");

    $state.go('main.login', {}, {reload: true});
  }
})

/****************************************************** Teacher's Main view Controller ******************************************************/
.controller('TeacherCtrl', function($scope,$state,$createquestions,$users) {

$scope.gotoCreateQuiz = function() {
  //$createquestions.setCurriculumAll();
   $state.go('main.teacherquestions'); 
}

$scope.gotoViewReports = function() {
  $state.go('main.reports'); 
}
})

/****************************************************** Teacher's Questions view Controller ******************************************************/
.controller('TeacherQuestionsCtrl', function($mqtt, $scope, $createquestions, $users, $state) {
  $scope.questions = [];
  $scope.curriculum = {};
  $scope.grade="";
  $scope.sq = [];
  var Tosend = [];
  id= 0;
  var k =0;

$scope.setDisplay = function() {
  $scope.curriculum = $createquestions.getCurriculumAll();
}
  
   $scope.toggleCurriculum = function(curriculum) {
    if ($scope.isCurriculumShown(curriculum)) {
      $scope.shownCurriculum = null;
      console.log("cn");
    } else {
      $scope.shownCurriculum = curriculum;
      $createquestions.setCurriculum(curriculum);
    }
  }
  $scope.isCurriculumShown = function(curriculum) {
    return $scope.shownCurriculum === curriculum;
  }

  $scope.toggleGrade = function(grade) {
    if ($scope.isGradeShown(grade) && $scope.isCurriculumShown(null) != false) {
      $scope.shownGrade = null;
    } else {
      $scope.shownGrade = grade;
      $createquestions.setGrade(grade);
    }
  }

  $scope.isGradeShown = function(grade) {
    return ($scope.shownGrade === grade);
  };

  $scope.toggleSubject = function(subject) {
    if ($scope.isSubjectShown(subject) && $scope.isUnitShown(null) != false) {
      $scope.shownSubject = null;
    } else {
      $scope.shownSubject = subject;
      $createquestions.setSubject(subject);
    }
  }

  $scope.isSubjectShown = function(subject) {
    return ($scope.shownSubject === subject);
  }

  $scope.toggleUnit = function(unit) {
    if ($scope.isUnitShown(unit) && $scope.isTopicShown(null) != false) {
      $scope.shownUnit = null;
    } else {
      $scope.shownUnit = unit;
      $createquestions.setUnit(unit);
    }
  }

  $scope.isUnitShown = function(unit) {
    return ($scope.shownUnit === unit);
  }

  $scope.toggleTopic = function(topic) {
    if ($scope.isTopicShown(topic) && $scope.isLOShown(null) != false) {
      $scope.shownTopic = null;
    } else {
      $scope.shownTopic = topic;
      $createquestions.setTopic(topic);
      console.log(topic);
    }
  }

  $scope.isTopicShown = function(topic) {
    return ($scope.shownTopic === topic);
  }
  var qID;

  $scope.toggleLO = function(lo) {
    if ($scope.isLOShown(lo)) {
      $scope.shownLO = null;
    } else {
      $scope.shownLO = lo;
      $createquestions.setLO(lo);
      console.log($createquestions.getCurriculum().id + "_" + $createquestions.getGrade().id  + "_" + $createquestions.getSubject().id + "_" + $createquestions.getUnit().id + "_" + $createquestions.getTopic().id + "_" + $createquestions.getLO().id);
      qID =  $createquestions.getCurriculum().id + "_" + $createquestions.getGrade().id  + "_" + $createquestions.getSubject().id + "_" + $createquestions.getUnit().id + "_" + $createquestions.getTopic().id + "_" + $createquestions.getLO().id;
      var myDataPromise = $createquestions.setQuestionsAll(qID);
      myDataPromise.then(function(result) { 
         $scope.questions = result; 
        $scope.getQuestions();

    }); 
    }
  }

  $scope.isLOShown = function(lo) {
    return ($scope.shownLO === lo);
  }

    $scope.getQuestions = function() {
    $scope.sq = [];

    var j=0;

    for(var i=0; i<$scope.questions.length;i++){
      console.log($scope.questions[i]);
        $scope.sq[j++]={name:($scope.questions[i].assessmentItem[0].itemBody[0].div[0].choiceInteraction[0].prompt), wholeq:$scope.questions[i]};
    } 
  }

  $scope.selectQuestion = function(s) {
    for(var i=0; i<$scope.sq.length;i++){
      if($scope.sq[i].name === s)
        Tosend[k++] = $scope.sq[i].wholeq;
      console.log(Tosend);
    }
  }

  $scope.sendQuestions = function(grade){
    $createquestions.setQuizID((new Date().getTime()).toString());
    $createquestions.setQuizIDQuestions(Tosend);

    console.log($createquestions.getQuizIDQuestions());
    
    //publish the quiz through mqtt
    $mqtt.publish(JSON.stringify($createquestions.getQuizIDQuestions()), grade, 1);
    $state.go('main.login', {}, {reload: true});

  }

})

/****************************************************** Analysis Reports view Controller ******************************************************/
.controller('DocumentController', function($scope, $ionicModal, PDFSService,$mqtt){
        var vm = this;
        setDefaultsForPdfViewer($scope);

        // Initialize the modal view.
        $ionicModal.fromTemplateUrl('pdf-viewer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.createPDFS = function () {
            var PDFFILE = $mqtt.getmessage();
            console.log(PDFFILE);
            var blob = new Blob([PDFFILE], { type: 'application/pdf' });

            $scope.pdfUrl = URL.createObjectURL(blob);

              // Display the modal view
              vm.modal.show();
/*            PDFSService.createPdf(PDFFILE)
                .then(function (pdf) {
                    var blob = new Blob([pdf], { type: 'application/pdf' });
                    $scope.pdfUrl = URL.createObjectURL(blob);

                    // Display the modal view
                    vm.modal.show();
                });*/


        // Clean up the modal view.
        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });

        return vm;
    }

    function setDefaultsForPdfViewer($scope) {
        $scope.scroll = 0;
        $scope.loading = 'loading';

        $scope.onError = function (error) {
            console.error(error);
        };

        $scope.onLoad = function () {
            $scope.loading = '';
        };

        $scope.onProgress = function (progress) {
            console.log(progress);
        };
    }

    function getDummyData() {
        return {
            Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),
            Student_list: {
        
                NameA: chance.name(),
        NameB: chance.name(),
        NameC: chance.name(),
        NameD: chance.name(),
        NameE: chance.name(),
        NameF: chance.name(),

            },

            Items: [
                { column1: '1', column2: '1', column3: '7' },
                { column1: '1', column2: '2', column3: '5' }
            ],
        };
    }
})
