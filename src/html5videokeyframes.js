 /*!
 * skrollr core
 *
 * ChocolateSlice - https://github.com/chocolateslice/HTML5VideoKeyframes
 *
 * Free to use under terms of MIT license
 */
(function(window, document, undefined) {
	'use strict';

	var vkf = {
		get: function() {
			return _instance;
		},
		init: function(options) {
			return _instance || new HTML5VideoKeyframes(options);
		},
		VERSION: '0.0.01'
	};
	
	/**
	 * Constructor
	 */
	function HTML5VideoKeyframes(options){
		// Instance
		_instance = this;
		// Instance properties
		this._videoElement = null;
		this._buffer = null;
		this._interval = null;
		this._keyframes = null;
		// Video element
		if(!options.id){
			console.log('No video id defined');
			return;
		}else{
			_instance._videoElement = document.getElementById(options.id);
		}
		// Keyframes
		if(!options.src){
			console.log('No keyframe src defined');
			return;
		}
		_instance._buffer = options.buffer || true;

		_instance._loadData(options.src).then(function(response){
			_instance._parseData(response);
		}, function(error){
			console.log('Error loading data', error);
		});
	}
	/**
	 * Public methods
	 */
	HTML5VideoKeyframes.prototype.gotoAndPlay = function(params){
		_instance._keyframeState().then(function(){
			var keyframeName; 
			var onComplete;
			var onBegin;
			if(params.constructor === Object){
				keyframeName = params.name;
				onBegin = params.onBegin || undefined;
				onComplete = params.onComplete || undefined;	
			}else if(params.constructor === String){
				keyframeName = params;
			}			
			var frameData = _keyframeByName(_instance, keyframeName);
			frameData.onComplete = onComplete ? onComplete : frameData.complete;
			frameData.onBegin = onBegin ? onBegin : frameData.begin;
			_instance._seekTo(frameData.start);
			_instance._startInterval(frameData);
			_instance._play();
		}, function(){
			setTimeout(function(){
				_instance.gotoAndPlay(params);
			}, 50);
		});	
	};
	HTML5VideoKeyframes.prototype.stop = function(){
		_instance._stop();
	};
	HTML5VideoKeyframes.prototype.play = function(){
		_instance._play();
	};
	HTML5VideoKeyframes.prototype.pause = function(){
		_instance._pause();
	};
	HTML5VideoKeyframes.prototype.destroy = function(){
		clearInterval(_instance._interval);
		_instance = null;
	};
	/**
	 * Private variables
	 */
	var _instance;
	/**
	 * Private methods
	 */
	HTML5VideoKeyframes.prototype._keyframeState = function(){
		return new Promise(function(resolve, reject){
			if(_instance._keyframes){
				resolve();
			}else{
				reject();
			}
		});
	};
	HTML5VideoKeyframes.prototype._startInterval = function(frameData){
		if(frameData.onBegin) _ononKeyframeEvent(_instance, frameData.onBegin, frameData);

		_instance._stopInterval();

		_instance._interval = setInterval(function(){
			_instance._monitorInterval(frameData);
		}, 10);
	};
	HTML5VideoKeyframes.prototype._stopInterval = function(){
		try{ 
			clearInterval(_instance._interval); 
		}catch(e){}
	};
	HTML5VideoKeyframes.prototype._monitorInterval = function(frameData){		
		if(Math.round(_instance._videoElement.currentTime) === Math.round(frameData.end)){
			var remainder = 1 % (this._videoElement.currentTime / frameData.end);
			if(remainder === 0 || remainder === 1){
				_instance._stopInterval();
				_instance._pause();

				if(frameData.onComplete) _onKeyframeEvent(_instance, frameData.onComplete, frameData);			
			}
		}
	};
	HTML5VideoKeyframes.prototype._seekTo = function(time){
		_instance._videoElement.currentTime = time;
	};
	HTML5VideoKeyframes.prototype._play = function(){
		_instance._videoElement.play();
	};
	HTML5VideoKeyframes.prototype._stop = function(){		
		_instance._videoElement.currentTime = 0;
		_instance._videoElement.pause();
	};
	HTML5VideoKeyframes.prototype._pause = function(){
		_instance._videoElement.pause();
	};
	HTML5VideoKeyframes.prototype._loop = function(frameData){
		_instance._seekTo(frameData.start);
		_instance._startInterval(frameData);
		_instance._play();
	};
	HTML5VideoKeyframes.prototype._loadData = function(src){
		return new Promise(function(resolve, reject){
			var req = new XMLHttpRequest();
			req.open('GET', src, true);
			req.setRequestHeader("Content-type", "text/xml");
			req.onreadystatechange = function () {
				switch(this.readyState){
					case 0: // UNSENT / open has not been called yet
						break;
					case 1: // OPENED | send has not been called yet
						break;
					case 2: // HEADERS_RECEIVED | send has been called, and headers and status are available
						break;
					case 3: // LOADING | downloading - responseText holds partial data
						break;
					case 4: // DONE | operation is complete
						if (req.status == 200) {
							resolve(req.responseText);
						}else{
							reject(req.statusText);
						}
						break;
					default:
						break;
				}
			};
			req.onerror = function(){
				reject('Network Error');
			};
			req.send();
		});
	};
	HTML5VideoKeyframes.prototype._parseData = function(data){
		_instance._keyframes = xml2json.parser(data).keyframes;		
	};

	var _onKeyframeEvent = function(instance, params, frameData){
		if(params.constructor === String){
			_processEventsFromString(instance, params, frameData);
		}else if(params.constructor === Object){
			if(!params.func){
				console.log('Malformed params passed');
				return;
			}
			if(params.func.constructor === Array){
				for(var i=0; i<params.func.length; i++){
					if(params.func[i].constructor === String){
						_processEventsFromString(instance, params.func[i], frameData);						
					}else if(params.func[i].constructor === Object){
						_processKeyframeFunction(params.func[i]);
					}
				}
			}else if(params.func.constructor === Object){
				_processKeyframeFunction(params.func);
			}
		}
	};
	var _processEventsFromString = function(instance, params, frameData){
		switch(params){
			case 'stop':
				instance._stop();
				break;
			case 'loop':
				instance._loop(frameData);
				break;
			case 'pause':
				instance._pause();
				break;
			default: 
				instance._pause();
				break;
		}
	};

	var _processKeyframeFunction = function(func){
		var scope = !func.scope ? _instance : func.scope;
		if(scope.constructor === String) scope = eval(scope);
		if(scope.constructor === Object) scope = _instance;
		try{
			scope[func.name](func.params);
		}catch(e){
			console.log('function ' + func.name + ' with scope ' + scope + ' is undefined!');
		} 
	};

	var _keyframeByName = function(instance, name){
		var keyframes = instance._keyframes.keyframe;
		for(var i=0; i<keyframes.length; i++){
			if(keyframes[i].name == name) return keyframes[i];
		}
		return null;
	};

	var _promisePolyfill = function(){
		try{ 
			new Promise();
		}catch(e){
			ES6Promise.polyfill();
		}
	};

	_promisePolyfill();

	// Expose vkf as either a global variable or a require.js module.
	// I stole this bit fom skrollr...along with some other ideas. Sorry
	if(typeof define === 'function' && define.amd) {
		define([], function () {
			return vkf;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = vkf;
	} else {
		window.vkf = vkf;
	}

}(window, document));