"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// Density scales with canvas width: a phone viewport gets ~45% of the
// particles or the field reads as snow instead of drifting debris.
const DESKTOP_COUNT = 2400;
const MOBILE_COUNT = 1080;
const BODY_RATIO = 1400 / 2400;
const HANDLE_RATIO = 500 / 2400;

const BAG_W = 2.6;
const BAG_H = 2.7;
const BAG_R = 0.22;
const BAG_CY = -0.45;
const BAG_TOP = BAG_CY + BAG_H / 2;

// beige #e9e1cf, sage #95d5b2, leaf #52b788
const PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [0.914, 0.882, 0.812],
  [0.584, 0.835, 0.698],
  [0.322, 0.718, 0.533],
];

type Vec2 = { x: number; y: number };

function roundedRectPoint(t: number, w: number, h: number, r: number, out: Vec2) {
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const total = 2 * sw + 2 * sh + 4 * arc;
  let d = (((t % 1) + 1) % 1) * total;

  if (d < sw) {
    out.x = -sw / 2 + d;
    out.y = h / 2;
    return;
  }
  d -= sw;
  if (d < arc) {
    const a = Math.PI / 2 - (d / arc) * (Math.PI / 2);
    out.x = sw / 2 + Math.cos(a) * r;
    out.y = sh / 2 + Math.sin(a) * r;
    return;
  }
  d -= arc;
  if (d < sh) {
    out.x = w / 2;
    out.y = sh / 2 - d;
    return;
  }
  d -= sh;
  if (d < arc) {
    const a = -(d / arc) * (Math.PI / 2);
    out.x = sw / 2 + Math.cos(a) * r;
    out.y = -sh / 2 + Math.sin(a) * r;
    return;
  }
  d -= arc;
  if (d < sw) {
    out.x = sw / 2 - d;
    out.y = -h / 2;
    return;
  }
  d -= sw;
  if (d < arc) {
    const a = -Math.PI / 2 - (d / arc) * (Math.PI / 2);
    out.x = -sw / 2 + Math.cos(a) * r;
    out.y = -sh / 2 + Math.sin(a) * r;
    return;
  }
  d -= arc;
  if (d < sh) {
    out.x = -w / 2;
    out.y = -sh / 2 + d;
    return;
  }
  d -= sh;
  const a = Math.PI - (d / arc) * (Math.PI / 2);
  out.x = -sw / 2 + Math.cos(a) * r;
  out.y = sh / 2 + Math.sin(a) * r;
}

function handlePoint(t: number, radius: number, out: Vec2) {
  // open arc so handle ends land just inside the bag's top edge
  const a = Math.PI * (0.06 + 0.88 * t);
  out.x = Math.cos(a) * radius;
  out.y = BAG_TOP + Math.sin(a) * radius * 1.05;
}

function makeSpriteTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.65)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildParticleData(count: number) {
  const bodyCount = Math.round(count * BODY_RATIO);
  const handleCount = Math.round(count * HANDLE_RATIO);
  // scatter is normalized [-1, 1]; scaled per-frame so debris fills any viewport
  const scatter = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const phases = new Float32Array(count);
  const freqs = new Float32Array(count);
  const amps = new Float32Array(count);
  const p: Vec2 = { x: 0, y: 0 };

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    scatter[i3] = Math.random() * 2 - 1;
    scatter[i3 + 1] = Math.random() * 2 - 1;
    scatter[i3 + 2] = Math.random() * 2 - 1;

    if (i < bodyCount) {
      roundedRectPoint((i + Math.random() * 0.9) / bodyCount, BAG_W, BAG_H, BAG_R, p);
      p.y += BAG_CY;
      target[i3 + 2] = (Math.random() - 0.5) * 0.14;
    } else {
      const h = i - bodyCount;
      const inner = h >= handleCount;
      const j = inner ? h - handleCount : h;
      handlePoint((j + Math.random() * 0.9) / handleCount, inner ? 0.78 : 0.95, p);
      target[i3 + 2] = (inner ? -0.05 : 0.05) + (Math.random() - 0.5) * 0.08;
    }
    target[i3] = p.x + (Math.random() - 0.5) * 0.045;
    target[i3 + 1] = p.y + (Math.random() - 0.5) * 0.045;

    const roll = Math.random();
    const tone = PALETTE[roll < 0.55 ? 0 : roll < 0.9 ? 1 : 2];
    const brightness = 0.55 + Math.random() * 0.45;
    colors[i3] = tone[0] * brightness;
    colors[i3 + 1] = tone[1] * brightness;
    colors[i3 + 2] = tone[2] * brightness;

    delays[i] = Math.random() * 0.35;
    phases[i] = Math.random() * Math.PI * 2;
    freqs[i] = 0.15 + Math.random() * 0.4;
    amps[i] = 0.06 + Math.random() * 0.18;
  }

  const current = scatter.slice();
  const geometry = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(current, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", posAttr);
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 16);

  const texture = makeSpriteTexture();
  const material = new THREE.PointsMaterial({
    size: count < DESKTOP_COUNT ? 0.05 : 0.055,
    map: texture,
    transparent: true,
    opacity: count < DESKTOP_COUNT ? 0.7 : 0.85,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    sizeAttenuation: true,
  });

  return { geometry, posAttr, material, texture, scatter, target, delays, phases, freqs, amps };
}

function ParticleField({ progress }: { progress: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothRef = useRef(progress.current ?? 0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);
  const canvasWidth = useThree((s) => s.size.width);

  const count = canvasWidth < 768 ? MOBILE_COUNT : DESKTOP_COUNT;
  const { geometry, posAttr, material, texture, scatter, target, delays, phases, freqs, amps } =
    useMemo(() => buildParticleData(count), [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [geometry, material, texture]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const scale = Math.min(viewport.width / 4.2, viewport.height / 5.2, 1.15);
  const bagOffX = (viewport.width > 6.4 ? viewport.width * 0.16 : 0) / scale;
  const spreadX = (viewport.width * 0.58) / scale;
  const spreadY = (viewport.height * 0.58) / scale;

  useFrame((state, delta) => {
    smoothRef.current += ((progress.current ?? 0) - smoothRef.current) * Math.min(1, delta * 6);
    const sp = smoothRef.current;
    const t = state.clock.elapsedTime;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const d = delays[i];
      let lp = (sp - d) / (1 - d);
      if (lp < 0) lp = 0;
      else if (lp > 1) lp = 1;
      const e = lp * lp * (3 - 2 * lp);
      const am = amps[i] * (1 - e);
      const fq = freqs[i];
      const ph = phases[i];
      const sx = scatter[i3] * spreadX;
      const sy = scatter[i3 + 1] * spreadY;
      const sz = scatter[i3 + 2] * 1.4;
      pos[i3] = sx + (target[i3] + bagOffX - sx) * e + Math.sin(t * fq + ph) * am;
      pos[i3 + 1] = sy + (target[i3 + 1] - sy) * e + Math.cos(t * fq * 0.8 + ph * 1.7) * am;
      pos[i3 + 2] = sz + (target[i3 + 2] - sz) * e + Math.sin(t * fq * 0.6 + ph * 0.9) * am * 0.6;
    }
    posAttr.needsUpdate = true;

    const g = groupRef.current;
    if (g) {
      const k = Math.min(1, delta * 4);
      g.rotation.x += (-pointerRef.current.y * 0.05 - g.rotation.x) * k;
      g.rotation.y += (pointerRef.current.x * 0.05 - g.rotation.y) * k;
      g.rotation.z = Math.sin(t * 0.07) * 0.025 * (1 - sp);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.08, 0]} scale={scale}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

type Props = {
  progress: RefObject<number>;
  active?: boolean;
};

export function HeroParticles({ progress, active = true }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <ParticleField progress={progress} />
    </Canvas>
  );
}
