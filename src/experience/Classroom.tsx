import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = { scene: number; facultyName: string };

function Bench({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.08, 0.62]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.36, 0.26]}>
        <boxGeometry args={[2.1, 0.62, 0.06]} />
        <meshStandardMaterial color="#57391f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.34, -0.62]}>
        <boxGeometry args={[2.1, 0.1, 0.44]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.8} />
      </mesh>
      {[-0.95, 0.95].map((o) => (
        <mesh key={o} position={[o, 0.35, 0]}>
          <boxGeometry args={[0.09, 0.7, 0.58]} />
          <meshStandardMaterial color="#3f2a17" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function DustMotes({ count = 340 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 13;
      p[i * 3 + 1] = Math.random() * 4.2;
      p[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);

  useFrame((state, delta) => {
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = (arr[i * 3 + 1] ?? 0) + delta * 0.09;
      arr[i * 3] = (arr[i * 3] ?? 0) + Math.sin(state.clock.elapsedTime * 0.3 + i) * delta * 0.02;
      if ((arr[i * 3 + 1] ?? 0) > 4.3) arr[i * 3 + 1] = 0;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.035}
        color="#ffd9a0"
        transparent
        opacity={0.65}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function Classroom({ scene, facultyName }: Props) {
  const group = useRef<THREE.Group>(null);
  const target = scene === 0 || scene >= 3 ? 0 : 1;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-2.4 * delta);
    g.userData["o"] = THREE.MathUtils.lerp((g.userData["o"] as number) ?? 0, target, k);
    const o = g.userData["o"] as number;
    g.visible = o > 0.02;
    g.position.y = (1 - o) * -1.2;
    g.traverse((child) => {
      const m = (child as THREE.Mesh).material as THREE.Material | undefined;
      if (m && "opacity" in m) {
        (m as THREE.MeshStandardMaterial).transparent = true;
        (m as THREE.MeshStandardMaterial).opacity = o;
      }
    });
  });

  const boardWarm = scene >= 2;

  return (
    <group ref={group}>
      {/* lights */}
      <ambientLight intensity={boardWarm ? 0.35 : 0.65} color="#e8edf5" />
      <directionalLight
        position={[-5, 6, 4]}
        intensity={boardWarm ? 0.8 : 1.8}
        color="#fff5e4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[0, 3.6, -2.4]}
        intensity={boardWarm ? 12 : 8}
        color="#fff0d0"
        distance={14}
      />

      {/* floor (polished light tile) */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[16, 15]} />
        <meshStandardMaterial color="#b5a99c" roughness={0.4} />
      </mesh>

      {/* ceiling with square LED panels and hanging projector */}
      <mesh position={[0, 5.2, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[16, 15]} />
        <meshStandardMaterial color="#ede7dd" roughness={0.8} />
      </mesh>

      {/* square recessed LED lights on ceiling */}
      {[-3.6, 3.6].map((x) => (
        <group key={x} position={[x, 5.18, 0]}>
          <mesh rotation-x={Math.PI / 2}>
            <planeGeometry args={[1.5, 1.5]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={3.5}
              roughness={0.2}
            />
          </mesh>
          <pointLight color="#ffffff" intensity={2.2} distance={8} />
        </group>
      ))}

      {/* hanging ceiling projector */}
      <group position={[0, 4.5, -0.6]}>
        {/* hanging mount rod */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        {/* projector body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.22, 0.45]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.4} />
        </mesh>
        {/* projector lens */}
        <mesh position={[0.15, -0.02, -0.24]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial color="#0a2a4a" roughness={0.2} />
        </mesh>
      </group>

      {/* back wall (light cream / off-white) */}
      <mesh position={[0, 2.6, -4.2]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#e5dfd2" roughness={0.9} />
      </mesh>

      {/* side walls */}
      <mesh position={[-7.6, 2.6, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[15, 6]} />
        <meshStandardMaterial color="#ded7ca" roughness={0.9} />
      </mesh>
      <mesh position={[7.6, 2.6, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[15, 6]} />
        <meshStandardMaterial color="#ded7ca" roughness={0.9} />
      </mesh>

      {/* World map poster on left wall */}
      <group position={[-7.56, 2.4, -2.2]} rotation-y={Math.PI / 2}>
        <mesh>
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial color="#c2ddf5" roughness={0.6} />
        </mesh>
        {/* continent shapes sketch */}
        <mesh position={[-0.2, 0.3, 0.01]}>
          <planeGeometry args={[0.45, 0.4]} />
          <meshBasicMaterial color="#a0cf85" />
        </mesh>
        <mesh position={[0.2, 0.25, 0.01]}>
          <planeGeometry args={[0.55, 0.5]} />
          <meshBasicMaterial color="#d4b572" />
        </mesh>
        <mesh position={[0.15, -0.35, 0.01]}>
          <planeGeometry args={[0.4, 0.55]} />
          <meshBasicMaterial color="#cf9090" />
        </mesh>
      </group>

      {/* Front elevated stage / dais */}
      <mesh position={[0, 0.1, -3.4]} receiveShadow>
        <boxGeometry args={[15.6, 0.2, 2.2]} />
        <meshStandardMaterial color="#dcd4c6" roughness={0.8} />
      </mesh>

      {/* blackboard + projector screen + ventilation window */}
      <group position={[0, 2.3, -4.14]}>
        {/* Blackboard outer wooden frame */}
        <mesh>
          <boxGeometry args={[5.2, 2.4, 0.08]} />
          <meshStandardMaterial color="#403429" roughness={0.8} />
        </mesh>
        {/* Green chalkboard surface */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[4.96, 2.16]} />
          <meshStandardMaterial color="#1b3a2e" roughness={0.95} />
        </mesh>
        {/* Rolled-up white projection screen above the board */}
        <mesh position={[0, 1.35, 0.08]}>
          <boxGeometry args={[5.4, 0.18, 0.16]} />
          <meshStandardMaterial color="#f7f6f2" roughness={0.4} />
        </mesh>
        {/* Ventilation window with metal grill below the board */}
        <group position={[0, -1.48, 0.05]}>
          <mesh>
            <boxGeometry args={[3.6, 0.38, 0.06]} />
            <meshStandardMaterial color="#403c37" roughness={0.7} />
          </mesh>
          {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1].map((gx) => (
            <mesh key={gx} position={[gx, 0, 0.04]}>
              <boxGeometry args={[0.04, 0.36, 0.02]} />
              <meshStandardMaterial color="#1f1d1b" roughness={0.5} />
            </mesh>
          ))}
        </group>
        {/* chalk tray + chalk */}
        <mesh position={[0, -1.22, 0.12]}>
          <boxGeometry args={[5, 0.06, 0.16]} />
          <meshStandardMaterial color="#4a3726" roughness={0.85} />
        </mesh>
        <mesh position={[-1.2, -1.16, 0.14]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.03, 0.03, 0.24, 10]} />
          <meshStandardMaterial color="#f5f2e8" roughness={0.5} />
        </mesh>
      </group>

      {/* Wall clock to the right of the blackboard */}
      <group position={[3.6, 3.4, -4.14]}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.06]} />
          <meshStandardMaterial color="#faf6ed" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.22, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.06, 0.05]}>
          <boxGeometry args={[0.02, 0.14, 0.01]} />
          <meshBasicMaterial color="#222222" />
        </mesh>
        <mesh position={[0.05, 0, 0.05]} rotation-z={-Math.PI / 3}>
          <boxGeometry args={[0.02, 0.12, 0.01]} />
          <meshBasicMaterial color="#222222" />
        </mesh>
      </group>

      {/* Left wooden podium / lectern on dais (matching photo) */}
      <group position={[-2.4, 1.05, -3.2]}>
        {/* Main podium body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.7, 0.7]} />
          <meshStandardMaterial color="#4a2616" roughness={0.65} />
        </mesh>
        {/* Slanted reading top */}
        <mesh position={[0, 0.88, 0.04]} rotation-x={0.25}>
          <boxGeometry args={[0.98, 0.08, 0.78]} />
          <meshStandardMaterial color="#5a311e" roughness={0.6} />
        </mesh>
        {/* Round emblem / seal on front */}
        <mesh position={[0, 0.35, 0.36]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 20]} />
          <meshStandardMaterial color="#b89345" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Left side teacher table behind podium */}
      <group position={[-4.6, 0.55, -3.3]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.9]} />
          <meshStandardMaterial color="#825a38" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.65, 0.42, 0.75]} />
          <meshStandardMaterial color="#684525" roughness={0.75} />
        </mesh>
      </group>

      {/* Small table in front center */}
      <group position={[0, 0.45, -2.7]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.1, 0.06, 0.6]} />
          <meshStandardMaterial color="#3d2214" roughness={0.7} />
        </mesh>
        {[-0.45, 0.45].map((tx) => (
          <mesh key={tx} position={[tx, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.34, 0.48]} />
            <meshStandardMaterial color="#24140b" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Student benches: Two columns with clear central aisle (matching photo) */}
      {[0, 1, 2, 3].map((r) => (
        <group key={`row-${r}`}>
          {/* Left column benches */}
          <Bench x={-2.4} z={0.1 + r * 1.65} />
          {/* Right column benches */}
          <Bench x={2.4} z={0.1 + r * 1.65} />
        </group>
      ))}

      <DustMotes />
      <group userData={{ name: facultyName }} />
    </group>
  );
}
