// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.

// --------------------------------------------------------
// Initialize
// --------------------------------------------------------
var AudioCropper = require('com.composrapp.audiocropper');
Ti.API.info('module is => ' + AudioCropper);

// Setup in and output files
var originalAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'example1.mp3');
var croppedAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-example1.mp3');

// Create sounds
var inputSound = Ti.Media.createSound({url: originalAudio});
var outputSound = Ti.Media.createSound();

// Remove old cropped audio
if (croppedAudio.exists()) croppedAudio.deleteFile();

// --------------------------------------------------------
// Create window and audio playback buttons
// --------------------------------------------------------
var win = Ti.UI.createWindow({
  backgroundColor:'white'
});

var statusLabel = Ti.UI.createLabel({
  top: '30dp',
  text: '',
  color: '#2ecc71',
  opactity: 0
});

var cropMp3Btn = Ti.UI.createButton({
  bottom: 15,
  left: 0,
  width: '33.3%',
  title: 'Crop mp3'
});

var cropM4aBtn = Ti.UI.createButton({
  bottom: 15,
  left: '33.3%',
  width: '33.3%',
  title: 'Crop m4a'
});

var cropWavBtn = Ti.UI.createButton({
  bottom: 15,
  right: 0,
  width: '33.3%',
  title: 'Crop wav'
});

var originalAudioPlaybackBtn = Ti.UI.createButton({
  top: '140dp',
  width: Ti.UI.FILL,
  title: 'Play original audio'
});

var croppedAudioPlaybackBtn = Ti.UI.createButton({
  top: '240dp',
  width: Ti.UI.FILL,
  title: 'Play cropped audio'
});

win.add(statusLabel);
win.add(cropMp3Btn);
win.add(cropM4aBtn);
win.add(cropWavBtn);
win.add(originalAudioPlaybackBtn);
win.add(croppedAudioPlaybackBtn);

// --------------------------------------------------------
// Add button events listeners
// --------------------------------------------------------
cropMp3Btn.addEventListener('click', function() {
  originalAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'example1.mp3');
  croppedAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-example1.mp3');
  inputSound = Ti.Media.createSound({url: originalAudio});
  crop();
});

cropM4aBtn.addEventListener('click', function() {
  originalAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'example2.m4a');
  croppedAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-example2.m4a');
  inputSound = Ti.Media.createSound({url: originalAudio});
  crop();
});

cropWavBtn.addEventListener('click', function() {
  originalAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'example3.wav');
  croppedAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-example3.wav');
  inputSound = Ti.Media.createSound({url: originalAudio});
  crop();
});

originalAudioPlaybackBtn.addEventListener('click', function() {
  if (inputSound.playing) {
    inputSound.pause();
    originalAudioPlaybackBtn.title = 'Play original audio';
  } else {
    inputSound.play();
    originalAudioPlaybackBtn.title = 'Pause original audio';
  }
});

croppedAudioPlaybackBtn.addEventListener('click', function() {
  if (outputSound.playing) {
    outputSound.pause();
    croppedAudioPlaybackBtn.title = 'Play cropped audio';
  } else {
    outputSound.play();
    croppedAudioPlaybackBtn.title = 'Pause cropped audio';
  }
});

// --------------------------------------------------------
// Crop audio and event listeners
// --------------------------------------------------------
AudioCropper.addEventListener('success', function() {
  statusLabel.text = 'Successfully cropped audio';
  statusLabel.opactity = 1;
  outputSound.setUrl(croppedAudio);
});

AudioCropper.addEventListener('error', function() {
  statusLabel.text = 'Failed to crop audio';
  statusLabel.opactity = 1;
});

function crop() {
  // Update label
  statusLabel.text = '';
  statusLabel.opactity = 0;
  // Run the audio cropper
  setTimeout(function() {
    AudioCropper.cropAudio({
      cropStartMarker: 1.5,
      cropEndMarker: 3.5,
      audioFileInput: originalAudio,
      audioFileOutput: croppedAudio
    });
  }, 1000);
}

// --------------------------------------------------------
// Open window
// --------------------------------------------------------
win.open();
