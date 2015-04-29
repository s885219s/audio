$.getScript("three.js-master/build/three.js",function() {
    var context;
    var url="layla.mp3";
    var source;
    var buffer;
    var play=false;
    var analyser;
    var binCount;
    var level=0;
    var ffreqByteData;
    var bfreqByteData;
    var timeByteData;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var geometry = new THREE.CubeGeometry(2,2,2);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var cube = new THREE.Mesh(geometry, material); scene.add(cube);
    var t=0;
    camera.position.z = 5;
    window.addEventListener('load',init,false);
    // Step 1 - Initialise the Audio Context
    // There can be only one!


    function init() {
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
        analyser = context.createAnalyser();
        analyser.connect(context.destination);
        binCount = analyser.frequencyBinCount;
        ffreqByteData = new Float32Array(binCount);
    		bfreqByteData = new Uint8Array(binCount);
        timeByteData = new Uint8Array(binCount);
    }

    // Step 2: Load our Sound using XHR


    function startSound() {
        // Note: this loads asynchronously
        if(play==false){
        play=true;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        // Our asynchronous callback
        request.onload = function() {
            var audioData = request.response;
            audioGraph(audioData);
        };
        request.send();
      }
    }
    document.querySelector('.play').addEventListener('click', startSound);
    document.querySelector('.stop').addEventListener('click', stopSound);
    document.querySelector('.mic').addEventListener('click', getMicInput);

    function playSound() {
        // play the source now
        if(play==false){
        play=true;
        //console.log("0");
        source.noteOn(context.currentTime);
      }
    }

    function stopSound() {
        // stop the source now
        if(play==true){
        play=false;
        level=0;
        source.noteOff(context.currentTime);
      }
    }
    function audioGraph(audioData){
        source = context.createBufferSource();
        source.connect(analyser);
        buffer = context.createBuffer(audioData,true);
        source.loop = true;
        source.buffer=buffer;
        source.connect(context.destination);
        source.noteOn(0);
        update();
    }
    function getMicInput() {
  		stopSound();
  		//x-browser
  		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      console.log(navigator.getUserMedia);
  		if (navigator.getUserMedia) {

  			navigator.getUserMedia(
  				{audio: true},
  				function(stream) {
  					//reinit here or get an echo on the mic
  					source = audioContext.createBufferSource();
  					analyser = audioContext.createAnalyser();
  					//analyser.fftSize = 1024;
  					//analyser.smoothingTimeConstant = 0.3;

  					microphone = audioContext.createMediaStreamSource(stream);
  					microphone.connect(analyser);
  					play = true;
  					// console.log("here");
  				},
  				// errorCallback
  				function(err) {
  					alert("The following error occured: " + err);
  				}
  			);
  		}else{
  			alert("Could not getUserMedia");
  		}
  	}
    function update(){
      requestAnimationFrame(update);
      if (!play) return;
      analyser.getByteFrequencyData(bfreqByteData);
      analyser.getByteTimeDomainData(timeByteData);
      var sum=0;
      for(var i=0;i<binCount;i++){
      sum+=bfreqByteData[i];
      }
      level=sum/binCount;
    //  console.log(level);
    }
    function render() {
      requestAnimationFrame(render);
      //if (!play) return;
        camera.position.set( 0, 0, 2+(120-level)/10);
        cube.rotation.x += 0.1*(level/100);
        cube.rotation.y += 0.1*(level/100);
        renderer.render(scene, camera);
    }
    render();
});
