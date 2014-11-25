// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.

var AudioCropper = require('com.composrapp.audiocropper');
Ti.API.info('module is => ' + AudioCropper);

// Setup in and output files
var inputAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'test1.m4a');
var outputAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-test1.m4a');

// Remove old cropped audio
if (outputAudio.exists()) outputAudio.deleteFile();
// List applicationDataDirectory files
logAppDirFiles();

function logAppDirFiles() {
  var dirItems = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).getDirectoryListing();
  for (var i = 0; i < dirItems.length; i++) {
    var itemFullPath = Ti.Filesystem.separator + dirItems[i].toString();
    if (itemFullPath.indexOf('.m4a') != -1) Ti.API.info(itemFullPath);
  }
}

// Crop audio
AudioCropper.cropAudio({
  cropStartMarker: 4.5,
  cropEndMarker: 6.5,
  audioFileInput: inputAudio.resolve(),
  audioFileOutput: outputAudio.resolve()
});

AudioCropper.addEventListener('error', function() {
  Ti.API.error('Failed to crop audio');
});

AudioCropper.addEventListener('success', function() {
  Ti.API.info('Successfully cropped audio');
  logAppDirFiles();
});

// Open example window
var win = Ti.UI.createWindow({
  backgroundColor:'white'
});

win.open();
