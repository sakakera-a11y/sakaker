# Sakaker Official — Android starter

This is a separate Android application project. It does not modify the website or its existing Sakaker Official icon.

## Current implementation
- Opens the public YouTube channel at https://www.youtube.com/@sakakera.
- Requests Android's explicit "Display over other apps" permission before showing a movable floating window.
- Keeps a foreground notification while the floating player service is active.

## Build
Open this folder in Android Studio (Giraffe or newer) with JDK 17 and Android SDK 35, then build the **debug** APK.

A debug APK is for device testing only. A release APK/AAB needs a signing key and a release build configuration before Play Store distribution.

## Important limitations
- The floating window is an Android overlay. Android requires the user to grant the special overlay permission in Settings.
- YouTube may restrict playback inside embedded WebViews on some devices/accounts. The channel link is used as a starting point; test playback on a real Android device before treating this as release-ready.
- This Android project does not produce an iPhone app. iOS needs a separate Xcode/Swift project. Picture-in-Picture on iOS requires a supported media playback source; a YouTube channel page cannot simply be wrapped in AVPlayer.
- No website deployment is performed by this project.
