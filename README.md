# Offline Video SDK Tutorial App

This is a minimal, Expo + React Native app demonstrating how to use [`@TheWidlarzGroup/react-native-video-stream-downloader`](https://github.com/TheWidlarzGroup/react-native-video-stream-downloader) for offline video downloads and playback. The UI is designed for clarity in tutorials and articles.

## Features

- Download an open-source MP4 video for offline playback
- Play video only when downloaded (no online streaming)
- Delete downloaded video
- Modern UI
- Robust error handling and event-driven state management
- Built with Expo Router, Expo Dev Client, and React Native Video

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- Yarn or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Xcode/Android Studio for native builds (required for Dev Client)

### Installation

1. Clone this repository:

   ```sh
   git clone <your-fork-or-repo-url>
   cd react-native-video-expo
   ```

2. Install dependencies:

   ```sh
   yarn install
   # or
   npm install
   ```

3. Install Expo Dev Client (required for native modules):

   ```sh
   npx expo install expo-dev-client
   npx expo run:ios # or npx expo run:android
   ```

### Usage

- Launch the app in your Expo Dev Client.
- Use the download button to save the video for offline playback.
- Play the video only when it is fully downloaded.
- Delete the video to free up space.

## How It Works

- Uses `@TheWidlarzGroup/react-native-video-stream-downloader` for background downloads and event-driven updates.
- Video is stored locally and played with `react-native-video`.
- All UI and logic is contained in a single screen for clarity.
- No online streaming: video is only available offline after download.

## Customization

- To use your own video, update the video URL in `app/index.tsx`.
- UI and logic can be extended for playlists, multiple videos, etc.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
