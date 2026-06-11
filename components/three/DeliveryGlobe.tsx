"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type RefObject,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";

const GLOBE_RADIUS = 1;
const COLOR_BASE = "#0e2a1e";
const COLOR_RIM = "#52b788";
const COLOR_GRATICULE = "#95d5b2";
const COLOR_ARC = "#52b788";
const COLOR_HQ = "#ff6b4a";

type City = {
  name: string;
  lat: number;
  lon: number;
  volume: string;
  hq?: boolean;
};

// City volumes are illustrative shares of the real 40M+ cumulative total.
const HQ: City = {
  name: "Kakinada",
  lat: 16.99,
  lon: 82.25,
  volume: "40M+ bags since 2013",
  hq: true,
};

const SPOKES: City[] = [
  { name: "Hyderabad", lat: 17.38, lon: 78.48, volume: "1.4M+ bags / yr" },
  { name: "Visakhapatnam", lat: 17.69, lon: 83.22, volume: "1.1M+ bags / yr" },
  { name: "Vijayawada", lat: 16.51, lon: 80.65, volume: "950K+ bags / yr" },
  { name: "Chennai", lat: 13.08, lon: 80.27, volume: "820K+ bags / yr" },
  { name: "Bengaluru", lat: 12.97, lon: 77.59, volume: "760K+ bags / yr" },
  { name: "Mumbai", lat: 19.08, lon: 72.88, volume: "610K+ bags / yr" },
  { name: "Delhi", lat: 28.61, lon: 77.21, volume: "540K+ bags / yr" },
  { name: "Kolkata", lat: 22.57, lon: 88.36, volume: "430K+ bags / yr" },
  { name: "Pune", lat: 18.52, lon: 73.86, volume: "380K+ bags / yr" },
  { name: "Ahmedabad", lat: 23.02, lon: 72.57, volume: "310K+ bags / yr" },
];

const CITIES: City[] = [HQ, ...SPOKES];

export function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function buildGraticule(radius: number, step = 15, segments = 64): THREE.BufferGeometry {
  const positions: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };
  for (let lat = -75; lat <= 75; lat += step) {
    for (let i = 0; i < segments; i++) {
      const lonA = (i / segments) * 360 - 180;
      const lonB = ((i + 1) / segments) * 360 - 180;
      push(latLonToVec3(lat, lonA, radius), latLonToVec3(lat, lonB, radius));
    }
  }
  for (let lon = -180; lon < 180; lon += step) {
    for (let i = 0; i < segments; i++) {
      const latA = (i / segments) * 180 - 90;
      const latB = ((i + 1) / segments) * 180 - 90;
      push(latLonToVec3(latA, lon, radius), latLonToVec3(latB, lon, radius));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function createGlobeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(COLOR_BASE) },
      uRim: { value: new THREE.Color(COLOR_RIM) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uRim;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float facing = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
        float fresnel = pow(1.0 - facing, 2.6);
        vec3 color = mix(uBase, uRim, fresnel * 0.55);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

function createGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(82, 183, 136, 0.5)");
    gradient.addColorStop(0.7, "rgba(82, 183, 136, 0.16)");
    gradient.addColorStop(0.85, "rgba(82, 183, 136, 0.06)");
    gradient.addColorStop(1, "rgba(82, 183, 136, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

type DashMaterial = THREE.Material & { dashOffset: number };

function Arc({ from, to, reduced }: { from: City; to: City; reduced: boolean }) {
  const points = useMemo(() => {
    const start = latLonToVec3(from.lat, from.lon, GLOBE_RADIUS * 1.005);
    const end = latLonToVec3(to.lat, to.lon, GLOBE_RADIUS * 1.005);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(GLOBE_RADIUS * (1 + start.distanceTo(end) * 0.28));
    return new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(48);
  }, [from, to]);
  const phase = useMemo(() => Math.random() * 4, []);
  const dashRef = useRef<ComponentRef<typeof Line>>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    const line = dashRef.current;
    if (!line) return;
    (line.material as DashMaterial).dashOffset -= delta * 0.32;
  });

  return (
    <group>
      <Line
        points={points}
        color={COLOR_ARC}
        lineWidth={1}
        transparent
        opacity={0.2}
        depthWrite={false}
      />
      <Line
        ref={dashRef}
        points={points}
        color={COLOR_ARC}
        lineWidth={1.6}
        transparent
        opacity={0.9}
        dashed
        dashSize={0.07}
        gapSize={0.55}
        dashOffset={phase}
        depthWrite={false}
      />
    </group>
  );
}

type PinProps = {
  city: City;
  occlude: RefObject<THREE.Object3D>[];
  reduced: boolean;
  onActiveChange: (active: boolean) => void;
};

function Pin({ city, occlude, reduced, onActiveChange }: PinProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const open = hovered || focused;
  const prevOpen = useRef(false);

  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    onActiveChange(open);
  }, [open, onActiveChange]);

  const position = useMemo(
    () => latLonToVec3(city.lat, city.lon, GLOBE_RADIUS * 1.012),
    [city],
  );
  const ringQuaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  );
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!city.hq || reduced) return;
    const ring = ringRef.current;
    if (!ring) return;
    const t = (clock.getElapsedTime() % 2.4) / 2.4;
    ring.scale.setScalar(1 + t * 2);
    (ring.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - t);
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[city.hq ? 0.02 : 0.012, 16, 16]} />
        <meshBasicMaterial color={city.hq ? COLOR_HQ : COLOR_ARC} />
      </mesh>
      {city.hq && (
        <mesh ref={ringRef} quaternion={ringQuaternion}>
          <ringGeometry args={[0.026, 0.034, 32]} />
          <meshBasicMaterial
            color={COLOR_HQ}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html center occlude={occlude} zIndexRange={[40, 0]}>
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            aria-label={`${city.name}${city.hq ? ", headquarters" : ""}: ${city.volume}`}
            className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <span
              aria-hidden="true"
              className="block h-3.5 w-3.5 rounded-full border border-sage/0 transition-colors duration-300 group-hover:border-sage/70"
            />
          </button>
          {open && (
            <div
              aria-hidden="true"
              className="soft-shadow pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-leaf/30 bg-forest px-3.5 py-2.5"
            >
              <div className="serif flex items-baseline gap-2 text-[15px] font-light leading-none text-bone">
                {city.name}
                {city.hq && (
                  <span className="mono text-[9px] uppercase tracking-[0.2em] text-flame">
                    HQ
                  </span>
                )}
              </div>
              <div className="mono mt-1.5 text-[11px] leading-none text-sage">
                {city.volume}
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function GlobeScene({ reduced }: { reduced: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [activePins, setActivePins] = useState(0);
  const [dragging, setDragging] = useState(false);
  const gl = useThree((state) => state.gl);

  // OrbitControls sets touch-action: none; restore pan-y so the page
  // still scrolls vertically over the canvas on touch devices.
  useEffect(() => {
    gl.domElement.style.touchAction = "pan-y";
  }, [gl]);

  // Orient the globe so India faces the initial camera position. Yaw about Y
  // then pitch about X (instead of a single shortest-arc rotation) so the
  // north pole stays up and city latitudes read correctly.
  const orientation = useMemo(() => {
    const india = latLonToVec3(21.5, 80.5, 1).normalize();
    const yaw = -Math.atan2(india.x, india.z);
    const cameraElevation = Math.atan2(0.45, 2.8);
    const pitch = Math.asin(india.y) - cameraElevation;
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, "XYZ"));
  }, []);

  const globeMaterial = useMemo(() => createGlobeMaterial(), []);
  const graticule = useMemo(() => buildGraticule(GLOBE_RADIUS * 1.001), []);
  const glowMap = useMemo(() => createGlowTexture(), []);

  useEffect(
    () => () => {
      globeMaterial.dispose();
      graticule.dispose();
      glowMap.dispose();
    },
    [globeMaterial, graticule, glowMap],
  );

  const occludeList = useMemo(
    () => [sphereRef] as unknown as RefObject<THREE.Object3D>[],
    [],
  );

  const handlePinActive = useCallback((active: boolean) => {
    setActivePins((n) => n + (active ? 1 : -1));
  }, []);

  return (
    <>
      {/* Billboard glow at the origin plane; the nearer globe surface depth-masks
          its centre, leaving a soft halo around the rim only. */}
      <sprite scale={[2.6, 2.6, 1]}>
        <spriteMaterial map={glowMap} transparent opacity={0.85} depthWrite={false} />
      </sprite>
      <group quaternion={orientation}>
        <mesh ref={sphereRef} material={globeMaterial}>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        </mesh>
        <lineSegments geometry={graticule}>
          <lineBasicMaterial
            color={COLOR_GRATICULE}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </lineSegments>
        {SPOKES.map((city) => (
          <Arc key={city.name} from={HQ} to={city} reduced={reduced} />
        ))}
        {CITIES.map((city) => (
          <Pin
            key={city.name}
            city={city}
            occlude={occludeList}
            reduced={reduced}
            onActiveChange={handlePinActive}
          />
        ))}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        autoRotate={!reduced && activePins === 0 && !dragging}
        autoRotateSpeed={0.5}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </>
  );
}

export type DeliveryGlobeProps = {
  active?: boolean;
  className?: string;
};

export function DeliveryGlobe({ active = true, className }: DeliveryGlobeProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <Canvas
      className={className}
      frameloop={!reduced && active ? "always" : "demand"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.45, 2.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <GlobeScene reduced={reduced} />
    </Canvas>
  );
}
