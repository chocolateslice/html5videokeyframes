 /*!
 * skrollr core
 *
 * Richard Helliwell - https://github.com/chocolateslice/HTML5VideoKeyframes
 *
 * Free to use under terms of MIT license
 */
(function(window, document, undefined) {
	'use strict';

	var vkf = {
		get: function() {
			return _instance;
		},
		//Main entry point.
		init: function(options) {
			return _instance || new HTML5VideoKeyframes(options);
		},
		VERSION: '0.0.01'
	}
	
	/**
	 * Constructor
	 */
	function HTML5VideoKeyframes(options){
		// Instance
		_instance = this;
		// Video element
		if(!options.id){
			console.log('No video id defined');
			return;
		}else{
			_videoElement = document.getElementById(options.id);
		}
		// Keyframes
		if(!options.src){
			console.log('No keyframe src defined');
			return;
		}else{
			var src = options.src;
		}

		_loadXML(src);
	} 
	/**
	 * Public methods
	 */
	HTML5VideoKeyframes.prototype.gotoAndPlay = function(params){
		if(!_keyframes){
			console.log('No keyframe data loaded');
			return;
		}
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
		
		var frameData = _keyframeByName(keyframeName);
		frameData.onComplete = onComplete ? onComplete : frameData.complete;
		frameData.onBegin = onBegin ? onBegin : frameData.begin;

		_instance._seekTo(frameData.start);
		_instance._startInterval(frameData);
		_instance._play();
	}
	HTML5VideoKeyframes.prototype.stop = function(){
		_instance._stop();
	}
	HTML5VideoKeyframes.prototype.play = function(){
		_instance._play();
	}
	HTML5VideoKeyframes.prototype.pause = function(){
		_instance._pause();
	}
	HTML5VideoKeyframes.prototype.destroy = function(){
		clearInterval(_interval);

		_instance = null;
		_keyframes = null;
		_videoElement = null;
		_interval = null;
	}

	/**
	 * Private variables
	 */
	var _instance,
		_keyframes,
		_videoElement,
		_interval;
	/**
	 * Private methods
	 */
	HTML5VideoKeyframes.prototype._startInterval = function(frameData){
		if(frameData.onBegin) _processKeyframeEvent(_instance, frameData, 'onBegin');

		this._stopInterval();

		_interval = setInterval(function(){
			_instance._monitorInterval(frameData);
		}, 10);
	}
	HTML5VideoKeyframes.prototype._stopInterval = function(){
		try{ 
			clearInterval(_interval); 
		}catch(e){};
	}
	HTML5VideoKeyframes.prototype._monitorInterval = function(frameData){		
		if(Math.round(_videoElement.currentTime) === Math.round(frameData.end)){
			var remainder = 1 % (_videoElement.currentTime / frameData.end);
			if(remainder === 0 || remainder === 1){
				_instance._stopInterval();
				_instance._pause();

				if(frameData.onComplete) _onComplete(_instance, frameData.onComplete, frameData);			
			}
		}
	}	
	HTML5VideoKeyframes.prototype._seekTo = function(time){
		_videoElement.currentTime = time;
	}
	HTML5VideoKeyframes.prototype._play = function(){
		_videoElement.play();
	}
	HTML5VideoKeyframes.prototype._stop = function(){		
		_videoElement.currentTime = 0;
		_videoElement.pause();
	}
	HTML5VideoKeyframes.prototype._pause = function(){
		_videoElement.pause();
	}
	HTML5VideoKeyframes.prototype._loop = function(frameData){
		this._seekTo(frameData.start);
		this._startInterval(frameData);
		this._play();
	}

	var _loadXML = function(src){
		var ajaxReq = new XMLHttpRequest();
		ajaxReq.open('GET', src, true);	
		ajaxReq.setRequestHeader("Content-type", "text/xml");
		ajaxReq.onreadystatechange = function () {
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
					_parseXML(this.responseText);
					break;
				default:
					break;
			}
		}
		ajaxReq.send();
	}

	var _parseXML = function(xml){
		_keyframes = xml2json.parser(xml).keyframes;		
	}

	var _onComplete = function(instance, params, frameData){console.log(params.constructor, params)
		if(params.constructor === String){
			_processEventsFromString(instance, params, frameData)
		}else if(params.constructor === Array){

		}else if(params.constructor === Object){

		}
	}

	var _processEventsFromString = function(instance, params, frameData){
		switch(params){
			case 'stop':
				instance._stop();
				break;
			case 'loop':
				instance._loop(frameData)
				break;
			case 'pause':
				instance._pause();
				break;
			default: 
				instance._pause();
				break;
		}
	}

	var _processKeyframeEvent = function(instance, params, frameData){
		if(params.constructor === String){
			switch(params){
				case 'stop':
					instance._stop();
					break;
				case 'loop':
					instance._loop(frameData)
					break;
				case 'pause':
					instance._pause();
					break;
				default: 
					instance._pause();
					break;
			}
			return;
		}else if(params.constructor === Object){
			if(params.func.length){
				for(var i=0; i<params.func.length; i++){
					_processKeyframeFunction(params.func[i]);
				}
				return;
			}
			_processKeyframeFunction(params.func);
			return;
		}
		instance._pause();
		return;
	}

	var _processKeyframeFunction = function(func){
		var scope = !func.scope ? _instance : func.scope;
		if(scope.constructor === String) scope = eval(scope);
		if(scope.constructor === Object) scope = _instance;
		try{
			scope[func.name](func.params);
		}catch(e){
			console.log('function ' + func.name + ' with scope ' + scope + ' is undefined!');
		} 
	}

	var _keyframeByName = function(name){
		var keyframes = _keyframes.keyframe;
		for(var i=0; i<keyframes.length; i++){
			if(keyframes[i].name == name) return keyframes[i];
		}
		return null;
	}
	var _addEvent = vkf.addEvent = function(element, names, callback) {
	}
	var _removeEvent = vkf.removeEvent = function(element, names, callback) {
	}

	// Expose vkf as either a global variable or a require.js module.
	// I stole this bit fom skrollr
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