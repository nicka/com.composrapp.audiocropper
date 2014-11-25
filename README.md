# iOS Crop audio 

**Usage:**

Add module:

```
var AudioCropper = require('com.composrapp.audiocropper');
```

Specify in and output files:

```
var inputAudio = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'test1.m4a');
var outputAudio = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cropped-test1.m4a');
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
3. USe `gulp ios` to build and test the module

### TODO

Return blob on success instead of eventListener.
