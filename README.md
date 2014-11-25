# iOS Crop audio 

**Usage:**

Add module:

```
var AudioCropper = require('com.composrapp.audiocropper');
```

Specify in and output files:

```
var inputAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'example.mp3');
var outputAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-example.mp3');
```

Pass arguments to module:

```
AudioCropper.cropAudio({
  cropStartMarker: 4.5,
  cropEndMarker: 6.5,
  audioFileInput: inputAudio.resolve(),
  audioFileOutput: outputAudio.resolve()
});
```

Listen for events:

```
AudioCropper.addEventListener('error', function() {
  Ti.API.error('Failed to crop audio');
});

AudioCropper.addEventListener('success', function() {
  Ti.API.info('Successfully cropped audio');
});
```

### Development

1. Install packages with `npm install`
2. Update examples in `example/app.js`
3. Use `gulp ios` to build and test the module

### TODO

Cleanup eventListeners.
