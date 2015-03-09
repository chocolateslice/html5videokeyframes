# HTML5 Video Keyframes

JavaScript library for XML driven keyframes in HTML5 video.

While it does work on mobile the limitation is that the video has to be manually started before anything can happen. Tough but fair.

## Usage
Initialise
```
keyframeVideo = vkf.init({
	src: 'src.xml', // XML src file
	id: 'video-0' // ID of the video element
});	
```
DTD
```
<!ELEMENT keyframes (keyframe)>
<!ELEMENT keyframe (name, start, end, begin, complete)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT start (#PCDATA)>
<!ELEMENT end (#PCDATA)>
<!ELEMENT begin (#PCDATA)>
<!ELEMENT complete (#PCDATA)>  
```

XML schema
```
http://www.freeformatter.com
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

<xs:element name="keyframes">
  	<xs:complexType>
    	<xs:sequence>
    		<xs:element name="keyframe">
    			<xs:complexType>
    				<xs:sequence>
    						<xs:element name="to" type="xs:string"/>
    						<xs:element name="start" type="xs:string"/>
    						<xs:element name="end" type="xs:string"/>
    				</xs:sequence>
  				</xs:complexType>
    		</xs:element>
	<!--keyframe>
		<name>intro_loop</name>
		<start>0.00</start>
		<end>7.50</end>
		<complete>loop</complete>
	</keyframe>
	<keyframe>
		<name>to_wedding</name>
		<start>73.00</start>
		<end>76.00</end>
		<complete>
			<func>
				<name>gotoAndPlay</name>
				<params>wedding_loop</params>
				<scope></scope>
			</func>			
		</complete>
	</keyframe-->
		</xs:sequence>
  	</xs:complexType>
</xs:element>
```
## Dependencies

* [xml2json](https://github.com/ron-liu/xml2json) - XML to JSON Parser. Required for the conversion of the XML and available on bower.
* [es6-promise](https://github.com/components/es6-promise) - This is a polyfill of the ES6 Promise. Not strictly necessary but if you want it to work on IE or Safari you'll need this.

## Installation

bower install html5videokeyframes -save ... this is not yet set up

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

* Find alternative for eval (cause everyone gets their knickers in a twist when eval is used)
* Enable options buffering
* Check video load state
