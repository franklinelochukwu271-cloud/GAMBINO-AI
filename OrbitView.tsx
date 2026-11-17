import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import type { AssistantState } from "../hooks/useAssistant";
import { colors } from "../theme/colors";

type Props = { state: AssistantState };

export function OrbitView({ state }: Props) {
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    // GLView owns the rendering context. The animation loop is started in onContextCreate.
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const coreGeometry = new THREE.SphereGeometry(0.78, 48, 48);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x328fe0,
      emissive: 0x0b4d91,
      emissiveIntensity: 1.3,
      metalness: 0.5,
      roughness: 0.22,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.86, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0x9bd5ff, wireframe: true, transparent: true, opacity: 0.13 })
    );
    scene.add(shell);

    const ringMaterials = [0x9bcfff, 0xdceaff, 0x368fe8].map(
      (color) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })
    );
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.009, 8, 160), ringMaterials[0]),
      new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.007, 8, 160), ringMaterials[1]),
      new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.006, 8, 160), ringMaterials[2]),
    ];
    rings[0].rotation.set(0.8, 0.2, 0.45);
    rings[1].rotation.set(1.2, 0.7, -0.5);
    rings[2].rotation.set(0.2, 1.1, 0.2);
    rings.forEach((ring) => scene.add(ring));

    const ambient = new THREE.AmbientLight(0x8ebeff, 1.2);
    const point = new THREE.PointLight(0x57adff, 3.2, 12);
    point.position.set(2, 2, 3);
    scene.add(ambient, point);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 1.0;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x85c8ff, size: 0.025, transparent: true, opacity: 0.85 })
    );
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const current = stateRef.current;
      const speed = current === "thinking" ? 2.8 : current === "listening" ? 1.5 : 0.35;
      const pulse = current === "speaking" ? 1 + Math.abs(Math.sin(t * 8)) * 0.12 :
        current === "listening" ? 1.08 + Math.sin(t * 5) * 0.05 : 1 + Math.sin(t * 1.4) * 0.025;
      core.scale.setScalar(pulse);
      core.rotation.y = t * 0.25;
      shell.rotation.y = -t * 0.12;
      rings[0].rotation.z += 0.002 * speed;
      rings[1].rotation.x -= 0.0015 * speed;
      rings[2].rotation.y += 0.0025 * speed;
      particles.rotation.y = t * 0.035 * speed;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <View style={styles.wrap}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", height: 300, marginTop: 4, marginBottom: -2 },
  gl: { flex: 1, backgroundColor: "transparent" },
});