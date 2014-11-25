/**
 * audio_cropper
 *
 * Created by Nick den Engelsman
 * Copyright (c) 2014 Your Company. All rights reserved.
 */

#import "ComComposrappAudiocropperModule.h"

@implementation ComComposrappAudiocropperModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"10bc7a25-3fab-4c7e-b6cb-a85bb4257888";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"com.composrapp.audiocropper";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];

	NSLog(@"[INFO] %@ loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably

	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup

-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Listener Notifications

-(void)_listenerAdded:(NSString *)type count:(int)count
{
	if (count == 1 && [type isEqualToString:@"my_event"])
	{
		// the first (of potentially many) listener is being added
		// for event named 'my_event'
	}
}

-(void)_listenerRemoved:(NSString *)type count:(int)count
{
	if (count == 0 && [type isEqualToString:@"my_event"])
	{
		// the last listener called for event named 'my_event' has
		// been removed, we can optionally clean up any resources
		// since no body is listening at this point for that event
	}
}

#pragma Public APIs

-(void)cropAudio:(id)args
{
    NSDictionary * params = [args objectAtIndex:0];
    
    NSString *audioInput = [TiUtils stringValue:[params objectForKey:@"audioFileInput"]];
    NSURL *audioFileInput = [NSURL fileURLWithPath:audioInput];
    NSString *audioOutput = [TiUtils stringValue:[params objectForKey:@"audioFileOutput"]];
    NSURL *audioFileOutput = [NSURL fileURLWithPath:audioOutput];
    
    float cropStartMarker = [TiUtils floatValue:[params objectForKey:@"cropStartMarker"]];
    float cropEndMarker = [TiUtils floatValue:[params objectForKey:@"cropEndMarker"]];

    if (!audioFileInput || !audioFileOutput) {
        NSLog(@"[ERROR] No audioFileInput or audioFileOutput");
        [self fireEvent:@"error"];
        return NO;
    }

    // Remove old audioFileOutput file
    [[NSFileManager defaultManager] removeItemAtURL:audioFileOutput error:NULL];
    
    AVAsset *asset = [AVAsset assetWithURL:audioFileInput];
    
    AVAssetExportSession *exportSession = [AVAssetExportSession exportSessionWithAsset:asset
                                                                            presetName:AVAssetExportPresetPassthrough];
    
    if (exportSession == nil) {
        NSLog(@"[ERROR] Could not setup export session");
        [self fireEvent:@"error"];
        return NO;
    }
    
    CMTime startTime = CMTimeMake((int)(floor(cropStartMarker * 100)), 100);
    CMTime stopTime = CMTimeMake((int)(ceil(cropEndMarker * 100)), 100);
    CMTimeRange exportTimeRange = CMTimeRangeFromTimeToTime(startTime, stopTime);
    
    // Hack: Export to .mov to fix .mp3 exports
    exportSession.outputFileType = @"com.apple.quicktime-movie";
    exportSession.timeRange = exportTimeRange;
    
    // Format export path with .mov
    NSString *fileNameWithExtension = audioFileOutput.lastPathComponent;
    NSString *fileName = [fileNameWithExtension stringByDeletingPathExtension];
    NSString *extension = fileNameWithExtension.pathExtension;
    NSString *exportUrlStr = [audioOutput stringByReplacingOccurrencesOfString: extension withString:@"mov"];
    NSURL *exportUrl = [NSURL fileURLWithPath:exportUrlStr];
    
    // Remove old exportUrl file
    [[NSFileManager defaultManager] removeItemAtURL:exportUrl error:NULL];

    // Set final export audio url
    exportSession.outputURL = exportUrl;
    
    // Start cropping audio
    [exportSession exportAsynchronouslyWithCompletionHandler:^
     {
         if (AVAssetExportSessionStatusCompleted == exportSession.status) {
             // Rename file to desired audio file
             if ([self renameFileFrom:exportUrl to:audioFileOutput]) {
                 NSLog(@"[INFO] Cropped audio");
                 [self fireEvent:@"success"];
             } else {
                 NSLog(@"[ERROR] NSFileManager: Could not rename cropped audio %@", exportSession.error);
                 [self fireEvent:@"error"];
             }
         } else if (AVAssetExportSessionStatusFailed == exportSession.status) {
             NSLog(@"[ERROR] AVAssetExportSessionStatusFailed: Could not crop audio %@", exportSession.error);
             [self fireEvent:@"error"];
         } else {
             NSLog(@"[ERROR] Could not crop audio %d", exportSession.status);
         }
     }];
    
    return YES;
}

- (BOOL)renameFileFrom:(NSURL*)oldPath to:(NSURL *)newPath
{
    NSString *oldFile = [oldPath path];
    NSString *newFile = [newPath path];
    NSError *error = nil;
    
    if (![[NSFileManager defaultManager] moveItemAtPath:oldFile toPath:newFile error:&error]) {
        NSLog(@"[ERROR] Failed to move '%@' to '%@': %@", oldPath, newPath, [error localizedDescription]);
        return NO;
    }
    
    return YES;
}

@end
