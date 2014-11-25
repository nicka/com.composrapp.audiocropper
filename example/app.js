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
var originalAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'test1.m4a');
var croppedAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-test1.m4a');

// Create sounds
var inputSound = Ti.Media.createSound({url: originalAudio});
var outputSound = Ti.Media.createSound();

// Remove old cropped audio
if (croppedAudio.exists()) croppedAudio.deleteFile();

// --------------------------------------------------------
// Crop audio and events
// --------------------------------------------------------
AudioCropper.cropAudio({
  cropStartMarker: 4.5,
  cropEndMarker: 6.5,
  audioFileInput: originalAudio,
  audioFileOutput: croppedAudio
});

AudioCropper.addEventListener('success', function() {
  // Show label
  statusLabel.animate({
    opactity: 1,
    duration: 250
  });
  // Update cropped audio sound
  outputSound.setUrl(croppedAudio);
});

AudioCropper.addEventListener('error', function() {
  // Show label
  statusLabel.text = 'Failed to crop audio';
  statusLabel.animate({
    opactity: 1,
    color: '#bf1200',
    duration: 250
  });
});

// --------------------------------------------------------
// Create window and audio playback buttons
// --------------------------------------------------------
var win = Ti.UI.createWindow({
  backgroundColor:'white'
});

// Add status label
var statusLabel = Ti.UI.createLabel({
  top: '30dp',
  text: 'Successfully cropped audio',
  color: '#2ecc71',
  opactity: 0
});

// Add original audio playback button 
var originalAudioPlaybackBtn = Ti.UI.createButton({
  top: '140dp',
  title: 'Play original audio'
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

// Add cropped audio playback button 
var croppedAudioPlaybackBtn = Ti.UI.createButton({
  top: '240dp',
  title: 'Play cropped audio'
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

win.add(statusLabel);
win.add(originalAudioPlaybackBtn);
win.add(croppedAudioPlaybackBtn);

win.open();
