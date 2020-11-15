window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
    camStart();
}

// Override the function with all the posibilities
navigator.getUserMedia ||
        (navigator.getUserMedia = navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia || navigator.msGetUserMedia);
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext;
var audioInput = null,
    realAudioInput = null,
    inputPoint = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

var canvas;
var index = 0;
var ix = 1;
var clearDisplay = 1;

var splash;
var button;
var button1;
var button2;
var button3;
var btnBack;
var plus;
var settings;
var panel;
var panelvisible = false;
var colPick;
var progress;
var vol1;
var vol2;
var aspect;
var nAgt = navigator.userAgent;
var currentImage = 1;
// var fcol;
// var bcol;
// var doingRainbow = "1";
var imageObj = new Image();
var foreObj = new Image();
var audiorunning = false;
var nextIndex = -1;
function convertToMono( input ) {
  var splitter = audioContext.createChannelSplitter(2);
  var merger = audioContext.createChannelMerger(2);

  input.connect( splitter );
  splitter.connect( merger, 0, 0 );
  splitter.connect( merger, 0, 1 );
  return merger;
}

function cancelAnalyserUpdates() {
  window.cancelAnimationFrame( rafID );
  rafID = null;
}

var scale;
var update = 0;
var volumeList = [];
var colorList = [];
var imageCount = [0,8,17,6,20,7,11,10,9];

var count = 0;
var current = 0;
var smoothMax = 0;
var scaleMax = 0;

function MakeColorList() {
  for (var i = 0; i < 20; i++)
    colorList[i] = "rgb(255,255,255)";
}


function updateAnalysers(time) {
var gotNoise = false;
var noiseCount = 0;
  if (!analyserContext) {
    canvas = document.getElementById("analyser");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    analyserContext = canvas.getContext('2d');
    scale = analyserNode.context.sampleRate/(2.7*44100);
    		scale = .5;
    		// create a temp canvas we use for copying and scrolling
     hScale = canvasHeight/256;
  }
  count ++;

  var max = 0;
  var rX = 0;
  var rY = 0;
   var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

  // first get volume into max;
  var previous = 0;
  var changeCount = 0;
  analyserNode.getByteTimeDomainData(freqByteData);
  for (var i = 0; i < freqByteData.length/2; ++i) {
      if (freqByteData[i] > max)
        max = freqByteData[i];
      if (freqByteData[i] < 127 && previous > 127)
        changeCount++;
      previous = freqByteData[i];
      // calculate if got noise here
  }
  if (changeCount > 6) { // randomise position for fricative
    if (count > 2)
      count = 1;
    rX = Math.random()*canvasWidth/100;
    rY = Math.random()*canvasHeight/100;
  }
  max = max - 127;
//  if (vol1.value < 50)
//    vol2.value++;
//  else
//    vol1.value--;
  smoothMax = (max + 7*smoothMax)/8;
  progress.value = smoothMax;
  scaleMax = Math.max((max-Math.min(vol1.value,vol2.value))*100/Math.abs(vol2.value-vol1.value),1);
  if (scaleMax > 100)
    scaleMax = 100;
  smoothMax = (scaleMax + 7*smoothMax)/8;

  switch (index) {
     case 1 : // rulers
      if (count == 1) {
        if (scaleMax <= 1) {
          scaleMax = 1;
        }
        analyserContext.fillStyle="#008F8F";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = smoothMax*canvasWidth/100;
        var y = smoothMax*canvasHeight/100;
        analyserContext.drawImage(imageObj,rX+canvasWidth*3/8,rY+(canvasHeight-y),canvasWidth/4,y);
      }
      else
        if (count > 5)
          count = 0;
     break;
    case 2 : // balloons
      if (count == 1) {
        if (scaleMax <= 1) {
          scaleMax = 1;
        }
        analyserContext.fillStyle="#1F4FFF";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        y = Math.max(y, canvasHeight/8);
        analyserContext.drawImage(imageObj,rX+(canvasWidth-canvasHeight/4)/2,rY+canvasHeight-y,canvasHeight/4,canvasHeight/3);
      }
      else
        if (count > 5)
          count = 0;
      break;
    case 3 : // gauge
      gaugeTarget.style.left = gaugeTarget.lft;
      gaugeTarget.style.top = gaugeTarget.tp;
      gauge.set(smoothMax);
      break;
    case 4 : // monsters
      if (count == 1) {
        if (scaleMax <= 10) {
          scaleMax = 10;
        }
        analyserContext.fillStyle="#FFFFFF";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        analyserContext.fillStyle="#FFFFFF";
        analyserContext.drawImage(imageObj,(canvasWidth-x)/2,(canvasHeight-y)/2,x,y);
      }
      else
        if (count > 5)
          count = 0;
      break;
    case 5 : // animals
      if (count == 1) {
        if (scaleMax <= 10) {
          scaleMax = 10;
        }
        analyserContext.fillStyle="#FFFFFF";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        analyserContext.drawImage(imageObj,(canvasWidth-x)/2,canvasHeight-y,x,y);
      }
      else
        if (count > 5)
          count = 0;
      break;
    case 6 : // jungle
      if (count == 1) {
        if (scaleMax <= 20) {
          scaleMax = 20;
        }
        analyserContext.fillStyle="#FFFFFF";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        analyserContext.drawImage(imageObj,0,canvasHeight/10,x,canvasHeight*.8);
        analyserContext.drawImage(foreObj,0,0,canvasWidth,canvasHeight);
      }
      else
        if (count > 5)
          count = 0;
      break;
    case 7 : // underwater
      if (count == 1) {
        if (scaleMax <= 15) {
          scaleMax = 15;
        }
        analyserContext.fillStyle="#0F6F8F";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        analyserContext.drawImage(imageObj,rX+canvasWidth/3,rY+canvasHeight-y,canvasWidth/3,canvasHeight/4);
        analyserContext.drawImage(foreObj,0,0,canvasWidth,canvasHeight);
      }
      else
        if (count > 5)
          count = 0;
      break;
    case 8 : // butterflys
      if (count == 1) {
        if (scaleMax <= 1) {
          scaleMax = 1;
        }
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        var x = scaleMax*canvasWidth/100;
        var y = scaleMax*canvasHeight/100;
        y = Math.max(y, canvasHeight/8);
        analyserContext.fillStyle="#8080FF";
        analyserContext.fillRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.drawImage(imageObj,rX+(canvasWidth-canvasHeight/2)/2,rY+canvasHeight-y,canvasHeight/2,canvasHeight/4);
      }
      else
        if (count > 5)
          count = 0;
      break;
  }
  clearDisplay = 0;
  rafID = window.requestAnimationFrame( updateAnalysers );
}


function gotStream(stream) {
audiorunning = true;

  inputPoint = audioContext.createGain();

  // Create an AudioNode from the stream.
  realAudioInput = audioContext.createMediaStreamSource(stream);
  audioInput = realAudioInput;
  audioInput.connect(inputPoint);

  //    audioInput = convertToMono( input );

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 1024; //2048;
  inputPoint.connect( analyserNode );

  //    audioRecorder = new Recorder( inputPoint );

  //    zeroGain = audioContext.createGain();
  //    zeroGain.gain.value = 0.0;
  //    inputPoint.connect( zeroGain );
  //    zeroGain.connect( audioContext.destination );
    if (nextIndex > 0) {
      index = nextIndex;
     setTimeout(restart, 500);
    }
    updateAnalysers();
}
 function restart() {
    Action(index);
 }

function initAudio() {
  if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
  if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

  navigator.getUserMedia({audio:true}, gotStream, function(e) {
      alert('Error getting audio');
      console.log(e);
  });

  if (iOS)
    updateAnalysers(); // add in for iOS
}

function MonitorKeyUp(e) {
  if (!e) e=window.event;
    if (e.keyCode == 32 || e.keyCode == 49)
        Action(4);
    if (e.keyCode == 50)
		Action(2);
    if (e.keyCode == 51  || e.keyCode == 13)
		Action(3);
    if (e.keyCode == 52)
		Action(1);
   return false;
}

var mouseState = 0;
function MonitorMouseDown(e) {
  if (!e) e=window.event;
    if (e.button == 0) {
        mouseState = 1;
        	mouseX =e.clientX/canvas.scrollWidth;
   		mouseY =1.0 - e.clientY/canvas.scrollHeight;
     }
  return false;
}

function MonitorMouseUp(e) {
  if (!e) e=window.event;
    if (e.button == 0) {
        mouseState = 0;
     }
  return false;
}

function slideTo(el, left) {
  var steps = 10;
  var timer = 25;
  var elLeft = parseInt(el.style.left) || 0;
  var diff = left - elLeft;
  var stepSize = diff / steps;
  console.log(stepSize, ", ", steps);

  function step() {
      elLeft += stepSize;
      el.style.left = elLeft + "vw";
      if (--steps) {
          setTimeout(step, timer);
      }
  }
  step();
}


StoreValue = function (key, value) {
  if (window.localStorage) {
     window.localStorage.setItem(key, value);
  }
};

RetrieveValue = function(key, defaultValue) {
  var got;
  try {
     if (window.localStorage) {
       got = window.localStorage.getItem(key);
       if (got == 0) {
                      return got;
       }
       if (got == "") {
                      return got;
       }
       if (got) {
                      return got;
       }
       return defaultValue;
     }
     return defaultValue;
  } catch (e) {
     return defaultValue;
  }
};

var doingFore = false;
var gauge;
var gaugeTarget;
function camStart() {
  // var foreground = document.querySelector('foreground');
  // var rainbow = document.querySelector('rainbow');
  // var bground = document.querySelector('background');
  // fcol = document.querySelector('fcol');
  // bcol = document.querySelector('bcol');

  splash  = document.querySelector('splash');
  panel  = document.querySelector('panel');
  settings  = document.querySelector('settings');
  button = document.querySelector('button');
  button1 = document.querySelector('button1');
  button2 = document.querySelector('button2');
  button3 = document.querySelector('button3');
  button4 = document.querySelector('button4');
  button5 = document.querySelector('button5');
  button6 = document.querySelector('button6');
  button7 = document.querySelector('button7');
  btnBack = document.querySelector('back');
  btnPlus = document.querySelector('plus');
  canvas = document.getElementById("analyser");
  canvas.style.backgroundColor = '#202020';

  gaugeTarget = document.getElementById('gauge');
  // colPick = document.getElementById('myColor');
  progress = document.getElementById('progress');
  //        analyserContext = canvas.getContext('2d');
  panel.style.left = "130vw";
  slideTo(panel, 130);
  settings.style.left = "89vw";
  var chromeOS = false; // this checks for Chrome Operating system /(CrOS)/.test(navigator.userAgent);
    
  btnBack.onclick = function(e) {
    panel.hidden = false;
    settings.hidden = false;
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    button4.hidden = false;
    button5.hidden = false;
    button6.hidden = false;
    button7.hidden = false;
    btnBack.hidden = true;
    btnPlus.hidden = true;
  }
  
  btnPlus.onclick = function(e) {
    ix++;
    if (ix > imageCount[index])
      ix = 1;
    switch (index) {
    case 1:
      imageObj.src='images/Rulers/' + ix + '.png';
      break;
    case 2:
      imageObj.src='images/Balloons/' + ix + '.png';
      break;
    case 3: // gauge
      switch (ix) {
        case 1 :
          delete gauge;
          gaugeTarget.lft = '15vw';
          gaugeTarget.tp = '15vh';
          gaugeTarget.style.height = '70vh';
          gaugeTarget.style.width = '70vw';
           var opts = {
              lines: 12, // The number of lines to draw
              angle: 0.15, // The length of each line
              lineWidth: 0.44, // The line thickness
              pointer: {
                length: 0.3, // The radius of the inner circle
                strokeWidth: 0.045, // The rotation offset
                color: '#000000' // Fill color
              },
              limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
              colorStart: '#0000F0',
              colorStop: '#DA5A1A',
      //        percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]], // !!!!
              strokeColor: '#8080E0',   // background of gauge
              generateGradient:true
            };
          gauge = new Gauge(gaugeTarget).setOptions(opts); // create gauge!
          gauge.maxValue = 60; // set max gauge value
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
    //      gauge.percentColors = null;
          gauge.set(0); // set actual value
          gaugeTarget.hidden = false;
          gaugeTarget.style.backgroundColor = '#00FFFF';
          gaugeTarget.style.boxShadow = "0px 0px 20px white";
          gauge.setOptions(opts);
          gauge.render();
          break;
        case 2 :
          var opts = {
            lineWidth: 0.4, // The line thickness
            pointer: {
              length: 0.8, // The radius of the inner circle
              strokeWidth: 0.035, // The rotation offset
              color: '#ffffff' // Fill color
            },
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#6FADCF',   // Colors
            colorStop: '#2FC0FF',    // just experiment with them
            strokeColor: '#808080',   // to see which ones work best for you
            generateGradient: true
          };
          gaugeTarget.style.backgroundColor = '#000000';
          gauge.setOptions(opts);
          gauge.render();
          break;
        case 3 :
          var opts = {
            lineWidth: 0.25, // The line thickness
            pointer: {
              length: 0.56, // The radius of the inner circle
              strokeWidth: 0.035, // The rotation offset
              color: '#ffffff' // Fill color
            },
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#1F69FF',   // Colors
            colorStop: '#1F69FF',    // just experiment with them
            percentColors: [[0.0, "#ffff00" ], [0.15, "#ffff00"], [0.16, "#00ff00"], [0.85, "#00ff00"], [0.84, "#ff0000"], [1.0, "#ff0000"]],
            strokeColor: '#FFFFFF',   // to see which ones work best for you
            generateGradient: true
          };
          gaugeTarget.style.backgroundColor = '#4F4F4F';
          gauge.setOptions(opts);
          gauge.render();
          break;
        case 4 :
          delete gauge;
          gaugeTarget.lft = '0vw';
          gaugeTarget.tp = '5vh';
          gaugeTarget.style.width = '100vw';
          gaugeTarget.style.height = '100vh';
          gaugeTarget.style.top = '0vh';
          var opts = {
            lineWidth: 0.15, // The line thickness
            angle: 0.15, // The length of each line
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#1F69FF',   // Colors
            colorStop: '#FF00FF',    // just experiment with them
            strokeColor: '#8888FF',   // to see which ones work best for you
            generateGradient: true
          };

          gauge = new Donut(gaugeTarget).setOptions(opts); // create gauge!
          gauge.maxValue = 60; // set max gauge value
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
    //      gauge.percentColors = null;
          gauge.set(0); // set actual value
          gaugeTarget.style.backgroundColor = '#202020';
          gaugeTarget.style.boxShadow = "none";
          break;
        case 5 :
          var opts = {
            angle: 0.2, // The length of each line
            lineWidth: 0.18, // The line thickness
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#000000',
            colorStop: '#dddddd',
            strokeColor: '#000000',   // background of gauge
            generateGradient:false
          };
          gauge.setOptions(opts);
          gauge.render();
          break;
        case 6 :
          gaugeTarget.tp = '5vh';
          var opts = {
            angle: 0.25, // The length of each line
            lineWidth: 0.25, // The line thickness
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#6F6EA0',
            colorStop: '#FF0000',
            strokeColor: '#000080',   // background of gauge
            generateGradient:true
          };
          gauge.setOptions(opts);
          gauge.render();
          break;

      }
      break;
    case 4:
      imageObj.src='images/Monsters/' + ix + '.png';
      break;
    case 5:
      imageObj.src='images/Animals/' + ix + '.png';
      break;
    case 6:
      imageObj.src='images/Jungle/' + ix + '.png';
      break;
    case 7:
      imageObj.src='images/Sea/' + ix + '.png';
      if (Math.random() < 0.3)
       foreObj.src='images/Backgrounds/2.png';
      else
       foreObj.src='images/Backgrounds/3.png';
     break;
    case 8:
      imageObj.src='images/Butterfly/' + ix + '.png';
      break;
    };
  }

 	button.onmousedown = function(e) {
   	Action(1);
  }
  button1.onmousedown = function(e) {
   	Action(2);
  }
  button2.onmousedown = function(e) {
   	Action(3);
  }
  button3.onmousedown = function(e) {
   	Action(4);
  }
  button4.onmousedown = function(e) {
   	Action(5);
  }
  button5.onmousedown = function(e) {
   	Action(6);
  }
  button6.onmousedown = function(e) {
   	Action(7);
  }
  button7.onmousedown = function(e) {
   	Action(8);
  }
  canvas.onkeyup = MonitorKeyUp;
  canvas.onmousedown = MonitorMouseDown;
  canvas.onmouseup = MonitorMouseUp;
  // fcol.style.backgroundColor = "#FFFF00";
  // bcol.style.backgroundColor = "#000000";

  progress.style.position = "absolute";
  progress.style.height = "1vh";
  progress.style.width = "12vw";
  progress.style.left = "6.5vw";
  progress.style.top = "18vh";

  vol1 = document.createElement("INPUT");
  vol1.setAttribute("type", "range");
  vol1.style.position = "absolute";
  vol1.style.height = "8vh";
  vol1.style.width = "12vw";
  vol1.style.left = "6.5vw";
  vol1.style.top = "10vh";
  vol1.value = 25;
  vol1.min = 1;

  vol2 = document.createElement("INPUT");
  vol2.setAttribute("type", "range");
  vol2.style.position = "absolute";
  vol2.style.height = "8vh";
  vol2.style.width = "12vw";
  vol2.style.left = "6.5vw";
  vol2.style.top = "19vh";
  vol2.value = 75;
  vol2.min = 1;

  // colPick.value ="#FF8040";
  // colPick.style.position = "absolute";
  // colPick.style.height = "3vh";
  // colPick.style.width = "3vw";
  // colPick.style.left = "11vw";
  // colPick.style.top = "33vh";

  panel.appendChild(vol1);
  panel.appendChild(vol2);
//  panel.appendChild(colPick);
  panel.appendChild(progress);
//  panel.appendChild(foreground);
//  panel.appendChild(rainbow);
//  panel.appendChild(bground);
//  panel.appendChild(fcol);
//  panel.appendChild(bcol);

  if (chromeOS) {
    chrome.storage.local.get(null, function (result) { // recover stored value
      if (result.vol1 == undefined) { // initial set up after first loaded
        vol1.value = 1;
        vol2.value = 50;
        bcol.style.backgroundColor = '#000000';
        fcol.style.backgroundColor = '#00FFFF';
        fcol.style.backgroundImage="url(images/rainbow.png)";
      }
      else {
        vol1.value = Math.abs(result.vol1);
        // if (result.vol1 < 0) {
        //   fcol.style.backgroundImage="url(images/rainbow.png)";
        // }
        // else
        //   doingRainbow = "0";
        vol2.value = result.vol2;
        // fcol.style.backgroundColor = result.foreground;
        // bcol.style.backgroundColor = result.background;
      }
     });
  }
  else {
    vol1.value = RetrieveValue("vol1", 0);
    vol2.value = RetrieveValue("vol2", 50);
    // doingRainbow = RetrieveValue("doingRainbow", "1");
    // bcol.style.backgroundColor = RetrieveValue("back", 0);
    // fcol.style.backgroundColor = RetrieveValue("fore", "rgb(255,255,0)");
    // if (doingRainbow == "1")
    //     fcol.style.backgroundImage="url(images/rainbow.png)";
    // else
    //     fcol.style.backgroundImage=null;
  }

  settings.onclick = function(e) {
   startAudio();
    if (panelvisible) { // save stored values
      slideTo(panel, 130);
      slideTo(settings,89);
      if (chromeOS) {
        if (vol1.value < 1)
          vol1 = 1;
        // if (doingRainbow == "1")
        //   chrome.storage.local.set({'vol1': -vol1.value});
        // else
          chrome.storage.local.set({'vol1': vol1.value});
        chrome.storage.local.set({'vol2': vol2.value});
        // chrome.storage.local.set({'foreground': fcol.style.backgroundColor});
        // chrome.storage.local.set({'background': bcol.style.backgroundColor});
      }
    else {
     // document.cookie="vol1="+vol1.value;
    // checkCookie();
    StoreValue("vol1", vol1.value);
    StoreValue("vol2", vol2.value);
    // StoreValue("doingRainbow", doingRainbow);
    // StoreValue("back", bcol.style.backgroundColor);
    // StoreValue("fore", fcol.style.backgroundColor);
  }

    }
    else {
      slideTo(panel, 75);
      slideTo(settings, 78);
    }
    // colPick.color.hidePicker();
    panelvisible = !panelvisible;

  }

  // bground.onclick = function(e) {
  //   doingFore = false;
  //   colPick.color.showPicker();
  // }

  // foreground.onclick = function(e) {
  //   doingFore = true;
  //   colPick.color.showPicker();
  // }

  // rainbow.onclick = function(e) {
  //   fcol.style.backgroundImage="url(images/rainbow.png)";
  //   colPick.color.hidePicker();
  //   doingRainbow = "1";
  // }

  // colPick.onchange = function(e) {
  //     if (doingFore) {
  //       fcol.style.backgroundColor = colPick.value;
  //       fcol.style.backgroundImage=null;
  //       doingRainbow = "0";
  //     }
  //     else
  //       bcol.style.backgroundColor = colPick.value;
  // }

    panel.onclick = function(e) {
    }

}

function startAudio()
{
    if (audioContext == null) {
    audioContext = new AudioContext();
    initAudio();
    }
}

function Action(i){
     nextIndex = i;
    startAudio();
  index = i;
  ix = 1;
  panel.hidden = true;
  panel.style.left = "130vw";
  panelvisible = false;
  settings.hidden = true;
  settings.style.left = "89vw";
  splash.hidden = true;
  button.hidden = true;
  button1.hidden = true;
  button2.hidden = true;
  button3.hidden = true;
  button4.hidden = true;
  button5.hidden = true;
  button6.hidden = true;
  button7.hidden = true;
  btnBack.hidden = false;
  btnPlus.hidden = false;
  clearDisplay = 1;
  count = 0;
  volumeList.length = 0;
  colorList.length = 0;
  analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
  aspect = canvasHeight/canvasWidth;
  gaugeTarget.hidden = true;
  if (gauge === undefined)
    ;
  else
    delete gauge;
  switch (i) {
    case 1:
      imageObj.src='images/Rulers/1.png';
      break;
    case 2:
      imageObj.src='images/Balloons/1.png';
      break;
    case 3: // gauge
      var opts = {
        lines: 12, // The number of lines to draw
        angle: 0.15, // The length of each line
        lineWidth: 0.44, // The line thickness
        pointer: {
          length: 0.3, // The radius of the inner circle
          strokeWidth: 0.045, // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
        colorStart: '#0000F0',
        colorStop: '#DA5A1A',
//        percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]], // !!!!
        strokeColor: '#8080E0',   // background of gauge
        generateGradient:true
      };
      gauge = new Gauge(gaugeTarget).setOptions(opts); // create gauge!
      gauge.maxValue = 60; // set max gauge value
      gauge.animationSpeed = 32; // set animation speed (32 is default value)
//      gauge.percentColors = null;
      gauge.set(0); // set actual value
      gaugeTarget.hidden = false;
      gaugeTarget.lft = '15vw';
      gaugeTarget.tp = '15vh';
      gaugeTarget.style.left = gaugeTarget.lft;
      gaugeTarget.style.top = "15vh";
      gaugeTarget.style.width = "70vw";
      gaugeTarget.style.height = "70vh";
      gaugeTarget.style.backgroundColor = '#00FFFF';
      break;
    case 4:
      imageObj.src='images/Monsters/1.png';
      break;
    case 5:
      imageObj.src='images/Animals/1.png';
      break;
    case 6:
      imageObj.src='images/Jungle/1.png';
      foreObj.src='images/Backgrounds/1.png';
      break;
    case 7:
      imageObj.src='images/Sea/1.png';
      foreObj.src='images/Backgrounds/2.png';
      break;
    case 8:
      imageObj.src='images/Butterfly/1.png';
      break;
  }
    
gamepads.addEventListener('connect', e => {
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
            StandardMapping.Axis.JOYSTICK_LEFT);
        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
            StandardMapping.Axis.JOYSTICK_RIGHT);
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();

    function Highlight() {
        button.style.opacity = .7;
        button1.style.opacity = .7;
        button2.style.opacity = .7;
        button3.style.opacity = .7;
        button4.style.opacity = .7;
        button5.style.opacity = .7;
        button6.style.opacity = .7;
        button7.style.opacity = .7;
        switch (menuItem) {
            case 0:
                button.style.opacity = 1.;
                break;
            case 1:
                button1.style.opacity = 1.;
                break;
            case 2:
                button2.style.opacity = 1.;
                break;
            case 3:
                button3.style.opacity = 1.;
                break;
            case 4:
                button4.style.opacity = 1.;
                break;
            case 5:
                button5.style.opacity = 1.;
                break;
            case 6:
                button6.style.opacity = 1.;
                break;
            case 7:
                button7.style.opacity = 1.;
                break;
        }
    }

    function showPressedButton(index) {
        console.log("Press: ", index);
        if (inMenu) {
            switch (index) {
                case 0: // A
                case 1: // B
                case 2: // X
                case 3: // Y
                    Go(menuItem);
                    break;
                case 12: // dup
                    if (menuItem > 3)
                        menuItem -= 4;
                    Highlight();
                    break;
                case 13: // ddown
                    if (menuItem < 4)
                        menuItem += 4;
                    Highlight();
                    break;
                case 14: // dleft
                    if (menuItem > 0)
                        menuItem--;
                    Highlight();
                    break;
                case 15: // dright
                    if (menuItem < 7)
                        menuItem++;
                    Highlight();
                    break;
            }
            console.log("Menu: ", menuItem);
        } else switch (index) {
            case 0: // A
            case 12: // dup
            case 6:
            case 8:
            case 9:
            case 11:
            case 16:
                Action(3);
                break;
            case 1: // B
            case 13: // ddown
            case 7:
                Action(4);
                break;
            case 2: // X
            case 4: // LT
            case 14: // dleft
                Action(5);
                break;
            case 3: // Y
            case 5: // RT
            case 15: // dright
                Action(6);
                break;
            case 10: // XBox
                showMenu();
                break;
            default:
        }
    }

    function removePressedButton(index) {
        console.log("Releasd: ", index);
    }

    function moveJoystick(values, isLeft) {
        console.log("Joystick: ", values[0], values[1]);
        if (values[1] >= 0 || values[1] >= 0) {
            XBoxVolume = Math.max(values[1], values[0]);
        }

    }

}

