var Music = function(a, b) {
    var audio, context;
	var playstatus = "stop";
    try {
        context = new(window.AudioContext || window.webAudioContext || window.webkitAudioContext)();
    } catch (e) {
        throw new Error('The Web Audio API is unavailable');
    }
    var processor = context.createScriptProcessor(1024),
        analyser = context.createAnalyser();
    processor.connect(context.destination);
    analyser.connect(processor);
    var data = new Uint8Array(analyser.frequencyBinCount);
    var Sound = {
        element: undefined,
        play: function() {
            var sound = context.createMediaElementSource(this.element);
			var duration = this.element.duration;
            this.element.onended = function() {
                sound.disconnect();
                sound = null;
                processor.onaudioprocess = function() {};
				resetAll();
				playstatus = "stop";
				button.className="musicbutton";
            };
			this.element.ontimeupdate=function(t){
				if(progressbar != null){
					var currentTime = this.currentTime;
					var process =  (currentTime / duration) * 100 +"%";
					progressbar.style.width= process;
				}
			};
            sound.connect(analyser);
            sound.connect(context.destination);
            processor.onaudioprocess = function() {
				analyser.getByteTimeDomainData(data);
            };
            this.element.play();
			playstatus = "play";
        },
		pause:function(){
			this.element.pause();
			playstatus = "pause";
		},
		stop:function(){
			this.element.stop();
			sound.disconnect();
            sound = null;
            processor.onaudioprocess = function() {};
		   resetAll();
		   playstatus = "stop";
		},
		continue:function(){
			if(this.element.paused){
				this.element.play();
				playstatus = "play";
			}
		}
    };

    function loadAudioElement(url) {
        return new Promise(function(resolve, reject) {
            var audio = new Audio();
            audio.addEventListener('canplay', function() {
                resolve(audio);
            });
            audio.addEventListener('error', reject);
            audio.src = url;
        });
    };
	
    var NUM_OF_SLICES = b.slicesnum,
        STEP = Math.floor(data.length / NUM_OF_SLICES),
        NO_SIGNAL = 256,
        slices = [],
        music = document.getElementById(a),
        height = music.offsetHeight,
        width = music.offsetWidth,
        widthPerSlice = width / NUM_OF_SLICES;
    music.style.position = "relative";
    var timer;

    function clickbtn() {
		
		if(playstatus == "stop"){
			button.className="musicbutton circlec";
			startPlay();
		}else if(playstatus == "play"){
			button.className="musicbutton";
			pausePlay();
		}else if(playstatus == "pause"){
			button.className="musicbutton circlec";
			continuePlay();
		}
    };
	  
		function continuePlay(){
			audio.continue();
			timer = setInterval(function() {
            render();
        }, b.interval);
		};
	
	  function pausePlay(){
		 audio.pause();
	  	clearInterval(timer);
		  for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n += STEP) {
            var slice = slices[i],
                mask = slice.elem;
            	mask.style.height = 0 + "px";
        }
	  };
	
	var progressbar = null;
	  function startPlay() {
        for (var i = 0; i < NUM_OF_SLICES; i++) {
            var offset = i * widthPerSlice;
            var mask = document.createElement('div');
            mask.style.width = widthPerSlice + 'px';
            mask.className="mask";
			mask.style.left = i *widthPerSlice +"px" ;
            mask.style.background = b.background;
            music.appendChild(mask);
            slices.push({
                offset: offset,
                elem: mask
            });
        }
		  
		  //progressbar
		  progressbar = document.createElement('div');
		  progressbar.className="progressbar";
		  progressbar.style.background = b.progressbarbg;
		   music.appendChild(progressbar);
        timer = setInterval(function() {
            render();
        }, b.interval);
        loadAudioElement(b.musicurl).then(function(elem) {
            audio = Object.create(Sound);
            audio.element = elem;
            audio.play();
        }, function(elem) {
            throw elem.error;
        });
    };
	
	function resetAll(){
		clearInterval(timer );
		for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n += STEP) {
            var slice = slices[i],
                mask = slice.elem;
            	mask.style.height = 0 + "px";
        }
		
		if(progressbar != null){
			progressbar.parentNode.removeChild(progressbar);
			progressbar = null;
		}
		
		setTimeout(function(){
			for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n += STEP) {
           	 	var slice = slices[i],
                	mask = slice.elem;
            		mask.parentNode.removeChild(mask);
        		}
				
				slices = [];
			},b.interval);
		
		
	 }

    function render() {
        for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n += STEP) {
            var slice = slices[i],
                mask = slice.elem,
                val = Math.floor(data[n] / NO_SIGNAL * height);
            mask.style.height = val + "px";
        }
    };
	
	function coverTime(time){
 	 time = parseInt(time);
  	var minute = Math.floor(time / 60);
 	 var seconds = time % 60;
 	 if(minute < 10) minute = "0"+minute;
 	 if(seconds < 10) seconds = "0"+seconds;
  	return minute + ":" + seconds;
	};
	
	 var button = document.createElement('button');
	button.innerText="♫";
	button.className="musicbutton";
	
	button.addEventListener('click', function(){
		clickbtn();
	});

    music.appendChild(button);
	
	
}