# Sakaker Official for iPhone and iPad

A native SwiftUI shell for https://www.sakaker.co/ using WKWebView. The channel button opens the official YouTube channel in the YouTube app when installed, or in the browser.

## Build
Open this directory with Xcode after generating the project:
`brew install xcodegen`
`cd sakaker-official-ios && xcodegen generate`
Then open `SakakerOfficial.xcodeproj` and run on an iOS 16+ simulator or device.

## Distribution
The GitHub workflow builds an unsigned device app for build verification. App Store/TestFlight distribution requires an Apple Developer account, signing certificate, provisioning profile, and App Store Connect submission. No credentials are stored in this repository.

## Platform behavior
iOS does not allow Android-style arbitrary floating windows over other apps. Picture-in-Picture depends on a supported video playback stream and is not promised for a YouTube channel webpage.
