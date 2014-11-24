// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

// TODO: write your module tests here
var audio_cropper = require('com.composrapp.audiocropper');
Ti.API.info("module is => " + audio_cropper);

var inputAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/test1.m4a');
var outputAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/cropped-test1.m4a');

var timmed_audio = audio_cropper.cropAudio({
	cropStartMarker: 10.0,
  cropEndMarker: 20.0,
  audioFileInput: inputAudio.resolve(),
  audioFileOutput: outputAudio.resolve()
});

Ti.API.info("timmed_audio " + timmed_audio);
