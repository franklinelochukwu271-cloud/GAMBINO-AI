import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Text, TextInput, View, Pressable, StyleSheet } from "react-native";
import { OrbitView } from "./src/components/OrbitView";
import { useAssistant } from "./src/hooks/useAssistant";
import { colors } from "./src/theme/colors";

export default function App() {
  const assistant = useAssistant();
  const [tab, setTab] = useState("HOME");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Product choice: the wake phrase is opt-in and not active in this scaffold.
    // The greeting plays only after the user taps the ORBIT / grants permission.
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>✧ GAMBINO</Text>
            <Text style={styles.eyebrow}>ARTIFICIAL INTELLIGENCE</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>ORBIT ONLINE</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.kicker}>YOUR PERSONAL INTELLIGENCE</Text>
          <Text style={styles.heading}>Hello, Commander.</Text>
        </View>

        <OrbitView state={assistant.state} />

        <View style={styles.statusBlock}>
          <Text style={styles.stateLabel}>{assistant.label.toUpperCase()}</Text>
          <Text style={styles.response}>{assistant.response}</Text>
          <Text style={styles.transcript}>{assistant.transcript}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Activate GAMBINO voice assistant"
          onPress={assistant.toggleVoice}
          style={({ pressed }) => [styles.mic, pressed && { transform: [{ scale: 0.96 }] }]}
        >
          <Text style={styles.micGlyph}>{assistant.state === "listening" ? "■" : "⌁"}</Text>
        </Pressable>
        <Text style={styles.hint}>{assistant.state === "listening" ? "TAP TO STOP LISTENING" : "TAP ORBIT TO SPEAK"}</Text>

        <View style={styles.composer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message GAMBINO..."
            placeholderTextColor={colors.muted}
            style={styles.messageInput}
            returnKeyType="send"
            onSubmitEditing={() => {
              const value = message.trim();
              if (value) { assistant.sendText(value); setMessage(""); }
            }}
            accessibilityLabel="Type a message for GAMBINO"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message to GAMBINO"
            disabled={!message.trim() || assistant.state === "thinking"}
            onPress={() => { assistant.sendText(message); setMessage(""); }}
            style={[styles.sendButton, (!message.trim() || assistant.state === "thinking") && styles.sendDisabled]}
          >
            <Text style={styles.sendGlyph}>↑</Text>
          </Pressable>
        </View>

        <View style={styles.quickRow}>
          <QuickAction label="Time" onPress={() => assistant.sendText("What time is it?")} />
          <QuickAction label="Motivate me" onPress={() => assistant.sendText("Give me motivation")} />
          <QuickAction label="Capabilities" onPress={() => assistant.sendText("What can you do?")} />
        </View>

        <View style={styles.bottomNav}>
          {["HOME", "DISCOVER", "DEVICES", "SETTINGS"].map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} style={styles.navItem}>
              <Text style={[styles.navText, tab === item && styles.navActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.footer}>GAMBINO AI · INTELLIGENCE WITHOUT LIMITS</Text>
      </View>
    </SafeAreaView>
  );
}

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, alignItems: "center" },
  header: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: colors.white, fontSize: 22, fontWeight: "800", letterSpacing: 3 },
  eyebrow: { color: colors.muted, fontSize: 9, letterSpacing: 2, marginTop: 3 },
  statusPill: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.line, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 11 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: colors.blue, marginRight: 7 },
  statusText: { color: colors.blue, fontSize: 9, letterSpacing: 1 },
  intro: { width: "100%", marginTop: 28 },
  kicker: { color: colors.muted, fontSize: 9, letterSpacing: 2 },
  heading: { color: colors.white, fontSize: 23, fontWeight: "600", marginTop: 6 },
  statusBlock: { alignItems: "center", minHeight: 75, paddingHorizontal: 12 },
  stateLabel: { color: colors.blue, fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  response: { color: colors.white, textAlign: "center", fontSize: 14, marginTop: 8 },
  transcript: { color: colors.muted, fontSize: 10, marginTop: 7, textAlign: "center" },
  mic: { width: 68, height: 68, borderRadius: 40, backgroundColor: colors.silver, justifyContent: "center", alignItems: "center", marginTop: 13, shadowColor: colors.blue, shadowOpacity: 0.55, shadowRadius: 20, elevation: 12 },
  micGlyph: { color: colors.background, fontSize: 30, fontWeight: "700" },
  hint: { color: colors.muted, fontSize: 9, letterSpacing: 2, marginTop: 10 },
  composer: { width: "100%", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 26, paddingLeft: 16, paddingRight: 6, marginTop: 18 },
  messageInput: { flex: 1, color: colors.white, fontSize: 13, paddingVertical: 12 },
  sendButton: { width: 38, height: 38, borderRadius: 22, backgroundColor: colors.blue, justifyContent: "center", alignItems: "center" },
  sendDisabled: { opacity: 0.35 },
  sendGlyph: { color: colors.background, fontSize: 24, fontWeight: "700", marginTop: -3 },
  quickRow: { width: "100%", flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 16 },
  quickAction: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 12 },
  quickText: { color: colors.silver, fontSize: 10 },
  bottomNav: { width: "100%", flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: colors.line, marginTop: "auto", paddingTop: 17, paddingBottom: 12 },
  navItem: { padding: 5 },
  navText: { color: colors.muted, fontSize: 9, letterSpacing: 1 },
  navActive: { color: colors.blue, fontWeight: "800" },
  footer: { color: colors.muted, fontSize: 8, letterSpacing: 1, paddingBottom: 12 }
});
