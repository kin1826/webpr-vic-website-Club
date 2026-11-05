import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

function SignalField() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const signals = useMemo(() => Array.from({ length: 52 }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2);
    const depth = -2.6 - (row % 9) * 0.22;
    const angle = row * 2.399;
    const radius = 2.5 + (row % 8) * 0.31;
    return {
      x: Math.cos(angle) * radius + side * 0.28,
      y: Math.sin(angle * 0.72) * 1.65,
      z: depth,
      size: 0.04 + (row % 3) * 0.012,
      phase: row * 0.68,
    };
  }), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.elapsedTime;
    signals.forEach((signal, index) => {
      dummy.position.set(
        signal.x + Math.sin(time * 0.18 + signal.phase) * 0.11,
        signal.y + Math.cos(time * 0.22 + signal.phase) * 0.08,
        signal.z,
      );
      dummy.scale.set(signal.size * (1 + Math.sin(time * 0.8 + signal.phase) * 0.14), 0.018, 0.018);
      dummy.rotation.z = Math.sin(signal.phase) * 0.42;
      dummy.updateMatrix();
      ref.current?.setMatrixAt(index, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, signals.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#72e7ef" toneMapped={false} transparent opacity={0.7} />
    </instancedMesh>
  );
}

function RailFrame({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number }) {
  const rail: [number, number, number] = [2.5, 0.075, 0.12];
  return (
    <group scale={scale} rotation={[0, rotation, 0]}>
      <RoundedBox args={rail} radius={0.035} smoothness={3} position={[0, 1.25, 0]}><meshStandardMaterial color="#193d70" metalness={0.86} roughness={0.26} /></RoundedBox>
      <RoundedBox args={rail} radius={0.035} smoothness={3} position={[0, -1.25, 0]}><meshStandardMaterial color="#193d70" metalness={0.86} roughness={0.26} /></RoundedBox>
      <RoundedBox args={[0.075, 2.5, 0.12]} radius={0.035} smoothness={3} position={[-1.25, 0, 0]}><meshStandardMaterial color="#0b1930" metalness={0.92} roughness={0.2} /></RoundedBox>
      <RoundedBox args={[0.075, 2.5, 0.12]} radius={0.035} smoothness={3} position={[1.25, 0, 0]}><meshStandardMaterial color="#0b1930" metalness={0.92} roughness={0.2} /></RoundedBox>
    </group>
  );
}

function CreationCore() {
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const modules = useRef<THREE.Group>(null);
  const plateMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#071a38", metalness: 0.88, roughness: 0.22 }), []);
  const ceramicMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f3f7ff", metalness: 0.28, roughness: 0.24 }), []);
  const cyanMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#72e7ef", emissive: "#37cbd8", emissiveIntensity: 2.1, toneMapped: false, metalness: 0.28, roughness: 0.18 }), []);

  useFrame(({ clock, pointer }) => {
    if (!root.current || !inner.current || !modules.current) return;
    const time = clock.elapsedTime;
    root.current.rotation.y += (pointer.x * 0.16 + Math.sin(time * 0.19) * 0.045 - root.current.rotation.y) * 0.025;
    root.current.rotation.x += (-pointer.y * 0.1 + Math.sin(time * 0.15) * 0.025 - root.current.rotation.x) * 0.025;
    root.current.position.y = Math.sin(time * 0.7) * 0.08;
    inner.current.rotation.y = -time * 0.09;
    inner.current.rotation.z = Math.sin(time * 0.3) * 0.04;
    modules.current.rotation.y = Math.sin(time * 0.22) * 0.06;
  });

  return (
    <group ref={root} rotation={[0.08, -0.2, -0.06]}>
      <RoundedBox args={[3.05, 3.05, 0.2]} radius={0.18} smoothness={5} material={plateMaterial} />
      <mesh position={[0, 0, 0.11]}><boxGeometry args={[2.64, 2.64, 0.035]} /><primitive object={ceramicMaterial} attach="material" /></mesh>
      <group position={[0, 0, 0.16]}>
        <RailFrame scale={1} rotation={0} />
        <RailFrame scale={0.72} rotation={Math.PI / 4} />
      </group>

      <group ref={inner} position={[0, 0, 0.32]}>
        <RoundedBox args={[1.14, 1.14, 0.44]} radius={0.2} smoothness={8}>
          <MeshTransmissionMaterial
            color="#143f78"
            transmission={0.96}
            thickness={0.72}
            roughness={0.12}
            ior={1.38}
            chromaticAberration={0.045}
            distortion={0.035}
            distortionScale={0.16}
            temporalDistortion={0.08}
            samples={4}
            resolution={256}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.23]}><boxGeometry args={[0.68, 0.09, 0.045]} /><primitive object={cyanMaterial} attach="material" /></mesh>
        <mesh position={[0, 0, 0.24]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.68, 0.065, 0.045]} /><primitive object={cyanMaterial} attach="material" /></mesh>
      </group>

      <group ref={modules}>
        {[
          [-1.25, 1.25, 0.3], [1.25, 1.25, -0.3], [-1.25, -1.25, -0.3], [1.25, -1.25, 0.3],
        ].map((position, index) => (
          <group key={index} position={position as [number, number, number]} rotation={[0.15, index * 0.35, 0]}>
            <RoundedBox args={[0.42, 0.42, 0.23]} radius={0.07} smoothness={4}><meshStandardMaterial color={index === 1 ? "#f3f7ff" : "#143f78"} metalness={0.78} roughness={0.2} /></RoundedBox>
            <mesh position={[0, 0, 0.13]}><boxGeometry args={[0.19, 0.035, 0.025]} /><primitive object={cyanMaterial} attach="material" /></mesh>
          </group>
        ))}
      </group>
      <pointLight color="#72e7ef" intensity={5} distance={5} position={[0, 0, 1.35]} />
    </group>
  );
}

function StudioScene() {
  return (
    <>
      <fog attach="fog" args={["#071a38", 9, 18]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 5, 7]} intensity={2.4} color="#f3f7ff" />
      <directionalLight position={[-5, -2, 2]} intensity={2.8} color="#2565ba" />
      <pointLight position={[0, 3, 1]} intensity={7} distance={11} color="#72e7ef" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 4]} scale={[7, 2, 1]} color="#dcecff" />
        <Lightformer form="rect" intensity={2} position={[-4, 1, -1]} scale={[2, 5, 1]} color="#258cc6" />
      </Environment>
      <SignalField />
      <group position={[0.3, 0, 0]}><CreationCore /></group>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.62} luminanceThreshold={1.05} mipmapBlur radius={0.42} />
      </EffectComposer>
    </>
  );
}

function CorePoster() {
  return (
    <div className="hyper-core-poster" aria-hidden="true">
      <div className="hyper-poster-frame"><i /><i /><i /><i /><b /><span /></div>
    </div>
  );
}

export function CreationScene({ active }: { active: boolean }) {
  return (
    <div className="hyper-scene">
      <CorePoster />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.4], fov: 34 }}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<CorePoster />}
      >
        <Suspense fallback={null}><StudioScene /></Suspense>
      </Canvas>
    </div>
  );
}
