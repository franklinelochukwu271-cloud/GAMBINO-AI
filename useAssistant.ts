import { useCallback, useRef, useState } from "react";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { useSpeechRecognitionEvent } from "expo-speech-recognition";
import {
  beginSpeechRecognition,
  cancelSpeechRecognition,
  isSpeechRecognitionAvailable,
  requestSpeechPermission,
} from "../services/speechRecognition";
import { askAssistant } from "../services/assistantApi";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "executing";

const GREETING = "Hello Commander, I'm listening.";

export function useAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const [label, setLabel] = useState("GAMBINO IS READY");
  const [response, setResponse] = useState("Your intelligence. Your universe.");
  const [transcript, setTranscript] = useState("Tap the ORBIT to speak to GAMBINO.");
  const finalHandled = useRef(false);
  const requestInFlight = useRef(false);

  const speak = useCallback((text: string) => {
    setState("speaking");
    setLabel("GAMBINO IS SPEAKING");
    void Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.12,
      rate: 0.94,
      onDone: () => { setState("idle"); setLabel("GAMBINO IS READY"); },
      onStopped: () => { setState("idle"); setLabel("GAMBINO IS READY"); },
      onError: () => { setState("idle"); setLabel("GAMBINO IS READY"); },
    });
  }, []);

  const sendText = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || requestInFlight.current) return;
    requestInFlight.current = true;
    setTranscript(`YOU: ${cleanText}`);
    setState("thinking");
    setLabel("PROCESSING YOUR REQUEST");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      const result = await askAssistant(cleanText);
      setResponse(result.text);
      speak(result.text);
    } catch {
      const fallback = "I received your request, Commander. The secure AI service is not connected yet.";
      setResponse(fallback);
      speak(fallback);
    } finally {
      requestInFlight.current = false;
    }
  }, [speak]);

  const startListening = useCallback(async () => {
    try {
      if (!isSpeechRecognitionAvailable()) {
        setState("idle");
        setLabel("VOICE SERVICE UNAVAILABLE");
        setResponse("This device does not currently have a speech-recognition service available. Check your device speech settings and try again.");
        setTranscript("SPEECH RECOGNITION NOT AVAILABLE");
        return;
      }

      const permission = await requestSpeechPermission();
      if (!permission.granted) {
        setState("idle");
        setLabel("MICROPHONE PERMISSION NEEDED");
        setResponse("Allow microphone and speech recognition access in your device settings to speak with GAMBINO.");
        setTranscript("VOICE ACCESS WAS NOT GRANTED");
        return;
      }

      finalHandled.current = false;
      setResponse("I'm listening, Commander. Speak your request.");
      setTranscript("MICROPHONE ACTIVE · SPEAK NOW");
      setLabel("GAMBINO IS LISTENING");
      setState("listening");
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      beginSpeechRecognition("en-US");
    } catch (error) {
      setState("idle");
      setLabel("VOICE INPUT UNAVAILABLE");
      setResponse("GAMBINO could not start voice recognition. Please try again.");
      setTranscript(error instanceof Error ? error.message : "Speech recognition could not start.");
    }
  }, []);

  useSpeechRecognitionEvent("start", () => {
    setState("listening");
    setLabel("GAMBINO IS LISTENING");
  });

  useSpeechRecognitionEvent("result", (event) => {
    const recognized = event.results?.[0]?.transcript?.trim();
    if (!recognized) return;
    setTranscript(`YOU: ${recognized}`);
    if (event.isFinal && !finalHandled.current) {
      finalHandled.current = true;
      void sendText(recognized);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    // A final result normally moves the assistant to THINKING before this event.
    setState((current) => current === "listening" ? "idle" : current);
    setLabel((current) => current === "GAMBINO IS LISTENING" ? "GAMBINO IS READY" : current);
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted") return;
    setState("idle");
    setLabel("VOICE INPUT INTERRUPTED");
    const message = event.error === "not-allowed"
      ? "Microphone or speech recognition permission was denied. Check your device settings."
      : event.error === "no-speech"
        ? "I didn't hear anything. Tap the ORBIT and try again."
        : event.error === "service-not-allowed"
          ? "The device speech service is unavailable. Enable speech recognition in device settings."
          : `Speech recognition error: ${event.message || event.error}.`;
    setResponse(message);
    setTranscript("VOICE SESSION ENDED");
  });

  const toggleVoice = useCallback(async () => {
    if (state === "listening") {
      finalHandled.current = true;
      cancelSpeechRecognition();
      setState("idle");
      setLabel("GAMBINO IS READY");
      setTranscript("VOICE SESSION STOPPED.");
      return;
    }

    if (state === "thinking" || state === "speaking") return;

    setResponse(GREETING);
    setLabel("GAMBINO IS GREETING YOU");
    setState("speaking");
    setTranscript("VOICE MODE · SAY WHAT YOU NEED AFTER THE GREETING.");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    void Speech.stop();
    Speech.speak(GREETING, {
      language: "en-US",
      pitch: 1.12,
      rate: 0.94,
      onDone: () => { void startListening(); },
      onError: () => { void startListening(); },
    });
  }, [startListening, state]);

  return { state, label, response, transcript, sendText, toggleVoice };
}
