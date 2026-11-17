import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

export type SpeechRecognitionStatus = "idle" | "listening" | "processing";

export type SpeechPermissionResult = {
  granted: boolean;
  status?: string;
  canAskAgain?: boolean;
};

/** Request microphone + speech-recognition permission after an explicit user action. */
export async function requestSpeechPermission(): Promise<SpeechPermissionResult> {
  return ExpoSpeechRecognitionModule.requestPermissionsAsync();
}

/** Check whether the device currently has a speech-recognition service available. */
export function isSpeechRecognitionAvailable(): boolean {
  return ExpoSpeechRecognitionModule.isRecognitionAvailable();
}

/** Start one user-initiated recognition session. */
export function beginSpeechRecognition(language = "en-US"): void {
  ExpoSpeechRecognitionModule.start({
    lang: language,
    interimResults: true,
    continuous: false,
    maxAlternatives: 1,
    addsPunctuation: true,
  });
}

/** Cancel without attempting to submit a partial transcript. */
export function cancelSpeechRecognition(): void {
  ExpoSpeechRecognitionModule.abort();
}
