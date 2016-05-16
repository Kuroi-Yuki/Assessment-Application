var ipaddress= "10.25.154.221"; 
angular.module('starter.services', []) 

.service( '$HardwareBackButtonManager', function($ionicPlatform){ 
  this.deregister = undefined; 

  this.disable = function(){ 
    this.deregister = $ionicPlatform.registerBackButtonAction(function(e){ 
      e.preventDefault(); 
      return false; 
    }, 101); 
  } 

  this.enable = function(){ 
    if( this.deregister !== undefined ){ 
      this.deregister(); 
      this.deregister = undefined; 
    } 
  } 
  return this; 
}) 

.factory('$mqtt', function() { 
var wsbroker = ipaddress; //mqtt websocket enabled broker 
var wsport = 8005 // port for above 
var mqtt; 
var reconnectTimeout = 2000; 
var msg =""; 
var studentClass =""; 
var currentrole = ""; 

function MQTTconnect(currentclass, role) { 
  var clientid = (new Date().getTime()).toString(); 
//Using the Broker create a new client representing the student or teacher 
mqtt = new Paho.MQTT.Client(wsbroker, wsport, clientid); 

//Connect Options 
var options = { 
  timeout: 3, 
  cleanSession: false, 
  onSuccess: function () { 
//connection attempt timeout in seconds 
console.log("mqtt connected"); 
// Connection succeeded; subscribe to our topic, you can add multile lines of these 
if(currentrole === "student"){ 
  console.log(studentClass); 
//var name="G2"; 
mqtt.subscribe("G2"); 
} 
else if(currentrole === "teacher"){ 
  console.log(currentrole); 
  mqtt.subscribe("realTimeAnalysis"); 
} 
}, 
onFailure: function (message) { 
  console.log("Connection failed: " + message.errorMessage); 
  setTimeout(MQTTconnect, reconnectTimeout); 
} 
}; 

mqtt.onConnectionLost = onConnectionLost; 
mqtt.onMessageArrived = onMessageArrived; 

mqtt.connect(options); 
} 

function onConnectionLost(response) { 
  setTimeout(MQTTconnect, reconnectTimeout); 
  console.log("connection lost: " + responseObject.errorMessage); 

}; 

function onMessageArrived(message) { 

  msg = message; 
// console.log(msg); 
if(currentrole === "teacher"){ 
  console.log(msg.destinationName, ' -- ', msg.payloadBytes); 
} 
else if(currentrole === "student"){ 
  console.log(msg.destinationName, ' -- ', msg.payloadString); 
} 
}; 

return { 
  getmessage: function(){ 
    if(currentrole === "student"){ 
      return JSON.parse(msg.payloadString); 
    } 
    else if(currentrole === "teacher"){ 
      return msg.payloadBytes; 
    } 

  }, 
//Attempt to connect 
init: function(currentclass, role) { 
  studentClass = currentclass; 
  currentrole = role; 
  MQTTconnect(); 
}, 

//Creates a new Message Object and sends it to the MQTT Broker 
publish: function (payload, topic, qos) { 
//Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations) 
var message = new Paho.MQTT.Message(payload); 
message.destinationName = topic; 
message.qos = qos; 
message.retained = true; 
console.log(message.payloadString); 
mqtt.send(message); 
}, 
unsubscribe: function (topic) { 
  mqtt.unsubscribe(topic); 
  console.log("unsubscribe") 

}/*, 
subscribe: function(topic){ 
mqtt.subscribe(topic); 
}*/ 

} 
}) 


.factory('$users', function($http) { 
// Might use a resource here that returns a JSON array 
var users = {}; 
var currentusername = ""; 
var currentrole = ""; 
var currentclass = ""; 

return { 
  getAll: function() { 
    $http.get("http://"+ipaddress+":8080/authenticate") 
    .then(function(response) { 
      users = response.data; 
    }) 
  }, 
//should change so the server does the filtering, not the device////////// 
authenticate: function(username, pw) { 
  for (var i = 0; i < users.length; i++) { 
    console.log(users[i].key + username + users[i].value.password + pw) 
    if (users[i].key === username && users[i].value.password === pw) { 
      currentusername = users[i].key; 
      currentrole = users[i].value.role; 
      if(currentrole === "student"){ 
        currentclass = users[i].value.grade; 
      } 
//console.log(currentclass); 
return true; 
} 
} 
return false; 
}, 
getCurrentusername: function(){ 
  return currentusername; 
}, 
getCurrentrole: function(){ 
  return currentrole; 
}, 
getCurrentclass: function(){ 
  return currentclass; 
}, 
setCurrentusername: function(username){ 
  currentusername = username; 
}, 
setCurrentclass: function(c){ 
  currentclass = c; 
}, 
setCurrentrole: function(role){ 
  currentrole = role; 
} 
/* setCurrentclass: function(class){ 
currentclass = class; 
}*/ 
} 
}) 

.factory('$questions', function() { 


//Should grab from couchdb 

var Questions = []; 
return { 
  setquestions: function(qs){ 
    console.log(qs); 
    console.log(qs.questions); 

    Questions = qs.questions; 
  }, 
  all: function() { 
    console.log(Questions); 

    return Questions; 
  }, 
  checkindex: function(index){ 
//console.log(Questions.length-2 == index); 
return ((Questions.length - 2) == index); 
} 
} 

}) 

.factory('$score', function() { 
  var score = 0; 
  var display = []; 

  return{ 
    getScore:function() 
    { 
      return score; 
    }, 
    updateScore:function(s){ 
      score = s; 
    }, 
    setDisplay:function(todisplay){ 
      display = todisplay; 

    }, 
    getDisplay:function(){ 
      return display; 

    } 

  } 

}) 

.factory('$createquestions', function($http) { 
  var curriculum = {}; 
  var questions = []; 

  var c; 
  var g; 
  var s; 
  var u; 
  var t; 
  var l; 
  var quiz = {}; 
  var qID = ""; 


  var setCurriculumAll = function() { 
//console.log(curriculum); 

$http.get("http://"+ipaddress+":8080/curriculum") 
.then(function(response) { 
  curriculum = response.data[0].value; 
//console.log(curriculum); 
}) 
} 

curriculum = setCurriculumAll(); 

return{ 

  setCurriculum: function(curri) { 
    c=curri; 
  }, 
  setGrade: function(grade) { 
    g = grade; 
  }, 
  setSubject: function(subject) { 
    s = subject; 
  }, 
  setUnit: function(unit) { 
    u = unit; 
  }, 
  setTopic: function(topic) { 
    t = topic; 
  }, 
  setLO: function(lo) { 
    l = lo; 
  }, 
  setQuestionsAll: function(qID) { 
    console.log(qID); 
    return $http.get("http://"+ipaddress+":8080/q/"+qID) 
    .then(function(response) { 
      console.log(response.data); 
      questions = response.data.questions; 
      return questions; 
    }) 
  }, 
  getCurriculum: function() { 
    return c; 
  }, 
  getGrade: function() { 
    return g; 
  }, 
  getSubject: function() { 
    return s; 
  }, 
  getUnit: function() { 
    return u; 
  }, 
  getTopic: function() { 
    return t; 
  }, 
  getLO: function() { 
    return l; 
  }, 
  getCurriculumAll: function(){ 
    return curriculum; 
  }, 
  setQuizID: function(ID){ 
    quiz.id=id; 
  }, 
  setQuizIDQuestions: function(qs){ 
    quiz.questions=qs; 
  }, 
  getQuizIDQuestions: function(){ 
    return quiz; 
  } 
} 
}) 

.factory('$context', function() { 
  var geolocation = {}; 
  var acc= {}; 

  var geoonSuccess = function(position){ 
    geolocation.Alt = position.coords.latitude; 
    geolocation.Long = position.coords.longitude; 
/////////////// 
/*alert(geolocation.Long); 
alert(geolocation.Alt); */
} 

function onError() { 
  alert('onError Geo!'); 
} 

navigator.geolocation.getCurrentPosition(geoonSuccess,onError); 

function accelerometerSuccess(acceleration) { 
  acc.x= acceleration.x; 
  acc.y= acceleration.y; 
  acc.z= acceleration.z; 

  //acc.absolute = Math.sqrt((acc.x*acc.x) + (acc.y*acc.y) + ( acc.z* acc.z)); 
  //alert(acc.absolute); 
} 

function accelerometerError() { 
  alert('onError ACC!'); 
} 

navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError); 


return { 
  getlocation: function (){ 
    return geolocation; 
  }, 
  getAcceleration: function (){ 
    return acc.absolute; 
  } 
} 
}) 

.factory('PDFSService', function($q){ 
  console.log("PDFSService"); 

  function createPdf(recievedpdf) { 
    console.log("createPdf"); 

    return $q(function (resolve, reject) { 
/* var dd = createDocumentDefinition(invoice); 
var pdf = pdfMake.createPdf(dd);*/ 
var pdf =recievedpdf; 
pdf.getBase64(function (recievedpdf) { 
  console.log("getBase64"); 

  resolve(base64ToUint8Array(recievedpdf)); 
}); 
}); 
  } 

  return { 
    createPdf: createPdf 
  }; 

  function createDocumentDefinition(stuff) { 

    var items = stuff.Items.map(function (item) { 
      return [item.column1, item.column2, item.column3]; 
    }); 

    var dd = { 
      content: [ 
      { text: '\n\nStudent Report', style: 'header' }, 
      { text: stuff.Date, alignment: 'left' }, 

      { text: 'List', style: 'subheader' }, 
      stuff.Student_list.NameA, 
      stuff.Student_list.NameB, 
      stuff.Student_list.NameC, 
      stuff.Student_list.NameD, 
      stuff.Student_list.NameE, 
      stuff.Student_list.NameF, 




      { text: 'Items', style: 'subheader' }, 
      { 
        style: 'itemsTable', 
        table: { 
          widths: ['*', 75, 75], 
          body: [ 
          [ 
          { text: 'Grade', style: 'itemsTableHeader' }, 
          { text: 'Quiz#', style: 'itemsTableHeader' }, 
          { text: 'Avg.', style: 'itemsTableHeader' }, 
          ] 
          ].concat(items) 
        } 
      }, 

      ], 
      styles: { 
        header: { 
          fontSize: 20, 
          bold: true, 
          margin: [0, 0, 0, 10], 
          alignment: 'right' 
        }, 
        subheader: { 
          fontSize: 16, 
          bold: true, 
          margin: [0, 20, 0, 5] 
        }, 
        itemsTable: { 
          margin: [0, 5, 0, 15] 
        }, 
        itemsTableHeader: { 
          bold: true, 
          fontSize: 13, 
          color: 'black' 
        }, 
        totalsTable: { 
          bold: true, 
          margin: [0, 30, 0, 0] 
        } 
      }, 
      defaultStyle: { 
      } 
    } 

    return dd; 
  } 

function base64ToUint8Array(base64) { // the pdf recieved through mqtt is passed here 
  var raw = atob(base64); 
  var uint8Array = new Uint8Array(raw.length); 
  for (var i = 0; i < raw.length; i++) { 
    uint8Array[i] = raw.charCodeAt(i); 
  } 
  return uint8Array; 
} 
})