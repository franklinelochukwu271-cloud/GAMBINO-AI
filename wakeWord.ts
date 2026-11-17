/**
 * Wake-word integration boundary.
 *
 * Production target phrase: "Hey GAMBINO".
 * This is intentionally an interface, not a fake always-on detector.
 * Integrate a native on-device wake-word SDK (for example, Picovoice Porcupine)
 * after reviewing its licensing, privacy terms, platform support and background
 * execution requirements. Require explicit opt-in and provide a visible mic state.
 */
export type WakeWordCallbacks = {
  onWake: () => void;
  onError: (error: Error) => void;
};

export interface WakeWordAdapter {
  requestConsent(): Promise<boolean>;
  start(callbacks: WakeWordCallbacks): Promise<void>;
  stop(): Promise<void>;
}

export const WAKE_PHRASE = "Hey GAMBINO";
