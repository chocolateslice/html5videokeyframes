# HTML5 Video Keyframes

JavaScript library for XML driven keyframes in HTML5 video.

While it does work on mobile the limitation is that the video has to be manually started before anything can happen. Tough but fair.

## Usage

I intend to document this but right now there is a decent example in the examples folder. 
It's called basic but it does everything it needs to show right now

## Dependencies

* [xml2json](https://github.com/ron-liu/xml2json) - XML to JSON Parser. Required for the conversion of the XML and available on bower.
* [es6-promise](https://github.com/components/es6-promise) - This is a polyfill of the ES6 Promise. Not strictly necessary but if you want it to work on IE or Safari you'll need this.

## Installation

//bower install html5videokeyframes -save

## Build
```
gulp
```
Uglifies the code and that's that

```
gulp build 
```
Concats dependacies and the libaray into one easy use file

## TODO:

* Write documentation
* Find alternative for eval (cause everyone gets their knickers in a twist when eval is used)