# GAMBINO AI — React Native starter

A cross-platform iOS + Android starter for the GAMBINO voice assistant concept.

## Product decisions included
- Brand: **GAMBINO AI**; activation greeting: **“Hello Commander, I'm listening.”**
- Voice + touch interaction with a black / silver / electric-blue identity.
- Three.js ORBIT scene with a metallic-blue core, orbital rings and particle field.
- Native speech-to-text integration for iOS and Android using `expo-speech-recognition`.
- Device text-to-speech using `expo-speech` (the available voice and accent depend on the device).
- Secure backend API adapter; no private model API key is shipped in the app.
- Wake phrase target: **Hey GAMBINO**. Always-on wake-word detection is not implemented yet.

## Requirements
- Node.js 22.13 or newer
- npm
- Android Studio / Android device for Android native builds
- macOS + Xcode for local iOS native builds, or EAS Build for cloud iOS builds

## Install and run
```bash
npm install
npx expo install --fix
npx expo-doctor
```

Speech recognition uses native code and its Expo config plugin, so use a development build rather than Expo Go:

```bash
npx expo run:android
# On macOS with Xcode:
npx expo run:ios
```

Alternatively, create a cloud development build with EAS:

```bash
npx eas-cli build --profile development --platform android
npx eas-cli build --profile development --platform ios
```

After the development build is installed on your device, start Metro with:

```bash
npx expo start --dev-client
```

## Voice interaction
1. Tap the ORBIT microphone control.
2. GAMBINO speaks: “Hello Commander, I'm listening.”
3. After the greeting finishes, the app requests microphone and speech-recognition permission if needed, then begins a one-shot listening session.
4. Live partial transcription appears on screen. When a final transcript arrives, it is sent to `askAssistant` and the response is spoken aloud.
5. Tap the control while listening to cancel the session. You can also type a message in the composer below the ORBIT and press send.

Speech recognition availability and language support depend on the device's installed recognition service, network and OS. Permission denial, no-speech and recognition errors are surfaced in the UI. Voice recognition has not yet been tested on physical iOS/Android devices in this workspace.

## Important implementation notes
1. `src/components/OrbitView.tsx` renders the ORBIT with Three.js via `expo-gl`.
2. `src/hooks/useAssistant.ts` coordinates permission requests, native speech recognition, transcript events, assistant requests, haptics and device text-to-speech.
3. `src/services/speechRecognition.ts` isolates the native speech-recognition permission, availability, start and cancel calls.
3. `app.json` configures the speech-recognition plugin and permission descriptions. Rebuild the native app after changing native plugin configuration.
4. `src/services/assistantApi.ts` calls your own backend at `POST /v1/assistant/message`. Without an API URL, local demo replies are used.
5. Do not put provider API secrets in `EXPO_PUBLIC_*` variables or in the mobile app. Keep provider credentials on your server.
6. The greeting plays only after deliberate user activation; the app does not listen automatically on launch.

## Production work still required
- Add an opt-in wake-word SDK for “Hey GAMBINO”, with on-device detection where possible, visible microphone status, battery testing and OS-compliant background behavior. iOS does not permit arbitrary always-on background microphone use.
- Add backend authentication, rate limits, abuse protection, user consent, retention controls and encrypted storage.
- Connect a streaming AI endpoint and premium neural TTS; the current speech output uses the device's installed voice.
- Add tests, accessibility review, crash reporting, app icons, splash screen, signing and store privacy disclosures.
- Test on real devices and multiple OS versions before release.

## SDK baseline
This starter targets Expo SDK 58 / React Native 0.88 / React 19.3. Use `npx expo install --fix` and `npx expo-doctor` after dependency changes. Check the official Expo SDK matrix before building.

## Backend contract
`POST /v1/assistant/message`
```json
{ "message": "Hello GAMBINO" }
```
Response:
```json
{ "text": "Hello Commander. I'm listening." }
```
