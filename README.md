# HTML5 Video Keyframes

JavaScript library for XML driven keyframes in HTML5 video.

While it does work on mobile the limitation is that the video has to be manually started before anything can happen.

## Usage
Initialise
```
keyframeVideo = vkf.init({
	wrapper: 'video-wrapper',
	props: {
		width: 320,
		height: 240,
		id: null,
		srcs: {
			mp4: 'http://dev.giantrobot.co.uk/basic.mp4',
			ogg: 'http://dev.giantrobot.co.uk/basic.ogg' 
		},
		attrs: {
			muted: true
		},
		forceReload: true
	},
	keyframes: 'basic.xml'	
});	
```
To a keyframe by name
```
keyframeVideo.gotoAndPlay('loop_name');
```
To a keyframe by name with additonal paramaters
```
keyframeVideo.gotoAndPlay({
	name:'loop_name',
	onComplete: {
		func:[
			'pause', // pause, loop or stop
			{
				name: 'functionToCallOnComplete',
				params: 'bar, foo',
				scope: window
			}
		]					
	}
});
```
Within the XML the only scope options are internal or window. JS function can call any scope

## Dependencies

* [xml2json](https://github.com/ron-liu/xml2json) - XML to JSON Parser. Required for the conversion of the XML and available on bower.
* [es6-promise](https://github.com/components/es6-promise) - This is a polyfill of the ES6 Promise. Not strictly necessary but if you want it to work on IE or Safari you'll need this.

## Installation

bower install html5videokeyframes -save

## Build
```
gulp
```
Uglifies the code and that's that

```
gulp build 
```
Concats dependacies and the libaray into one easy to use minified file

## TODO:

* Improve this stunningly bad documentation
* Potentially find a way to check the whole video is loaded before doing anything