import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

import { Classroom } from "./Classroom";
import { Galaxy } from "./Galaxy";
import { cameraKeys } from "./scenes";
import type { Faculty } from "../data/faculty";

function CameraRig({ scene }: { scene: number }) {
  const { camera, pointer } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.6, -4));

  useFrame((_, delta) => {
    const key = cameraKeys[Math.min(scene, cameraKeys.length - 1)] ?? cameraKeys[0]!;
    const k = 1 - Math.exp(-1.5 * delta);
    const [px, py, pz] = key.pos;
    camera.position.lerp(new THREE.Vector3(px + pointer.x * 0.45, py + pointer.y * 0.25, pz), k);
    look.current.lerp(new THREE.Vector3(...key.look), k);
    camera.lookAt(look.current);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(cam.fov, key.fov, k);
    cam.updateProjectionMatrix();
  });
  return null;
}

export function Experience({ scene, faculty }: { scene: number; faculty: Faculty }) {
  const isLanding = scene === 0;

  return (
    <div
      className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700 ease-in-out ${
        isLanding ? "opacity-0" : "opacity-100"
      }`}
    >
      <Canvas
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.65, 11], fov: 42 }}
      >
        <color attach="background" args={["#07060d"]} />
        <fog attach="fog" args={["#07060d", 14, 48]} />
        <Suspense fallback={null}>
          <CameraRig scene={scene} />
          <Classroom scene={scene} facultyName={faculty.name} />
          <Galaxy scene={scene} name={faculty.constellationName} qualities={faculty.qualities} />
        </Suspense>
      </Canvas>
    </div>
  );
}
