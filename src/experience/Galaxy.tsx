import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = { scene: number; name: string; qualities: string[] };

function useStarField(count: number) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.pow(Math.random(), 0.6) * 34;
      const theta = Math.random() * Math.PI * 2;
      const arm = Math.floor(Math.random() * 3) * ((Math.PI * 2) / 3);
      const spin = r * 0.09;
      const t = theta * 0.18 + arm + spin;
      pos[i * 3] = Math.cos(t) * r + (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6 * (1 - r / 60);
      pos[i * 3 + 2] = Math.sin(t) * r + (Math.random() - 0.5) * 6;
      c.setHSL(0.58 + Math.random() * 0.16, 0.7, 0.55 + Math.random() * 0.35);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);
}

/** Sample the teacher's name into star positions on an offscreen canvas. */
function useNamePoints(name: string, maxPoints = 260) {
  return useMemo(() => {
    if (typeof document === "undefined") return new Float32Array(0);
    const w = 512;
    const h = 128;
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext("2d");
    if (!ctx) return new Float32Array(0);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const size = Math.min(96, (w * 1.45) / Math.max(name.length, 4));
    ctx.font = `700 ${size}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(name.toUpperCase(), w / 2, h / 2);
    const data = ctx.getImageData(0, 0, w, h).data;
    const hits: Array<[number, number]> = [];
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if ((data[(y * w + x) * 4 + 3] ?? 0) > 128) hits.push([x, y]);
      }
    }
    const step = Math.max(1, Math.floor(hits.length / maxPoints));
    const picked = hits.filter((_, i) => i % step === 0).slice(0, maxPoints);
    const out = new Float32Array(picked.length * 3);
    picked.forEach(([x, y], i) => {
      out[i * 3] = (x / w - 0.5) * 11;
      out[i * 3 + 1] = -(y / h - 0.5) * 2.75;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    });
    return out;
  }, [name, maxPoints]);
}

function Constellation({ name, active }: { name: string; active: boolean }) {
  const pts = useNamePoints(name);
  const ref = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [pts]);

  const lines = useMemo(() => {
    const seg: number[] = [];
    const n = pts.length / 3;
    for (let i = 0; i < n; i++) {
      const ax = pts[i * 3] ?? 0;
      const ay = pts[i * 3 + 1] ?? 0;
      for (let j = i + 1; j < n; j++) {
        const bx = pts[j * 3] ?? 0;
        const by = pts[j * 3 + 1] ?? 0;
        const d = (ax - bx) ** 2 + (ay - by) ** 2;
        if (d < 0.16) seg.push(ax, ay, 0, bx, by, 0);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return g;
  }, [pts]);

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-2.6 * delta);
    const t = active ? 1 : 0;
    for (const r of [ref.current, lineRef.current]) {
      if (!r) continue;
      const m = r.material as THREE.Material & { opacity: number };
      m.opacity = THREE.MathUtils.lerp(m.opacity, t, k);
      r.visible = m.opacity > 0.01;
      r.scale.setScalar(THREE.MathUtils.lerp(r.scale.x, active ? 1 : 0.9, k));
    }
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      if (lineRef.current) lineRef.current.position.y = ref.current.position.y;
    }
  });

  return (
    <group position={[0, 1.4, 0]}>
      <points ref={ref} geometry={geo}>
        <pointsMaterial
          size={0.11}
          color="#ffe7b3"
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lineRef} geometry={lines}>
        <lineBasicMaterial color="#8fd0ff" transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function Orbs({ qualities, active }: { qualities: string[]; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-2.2 * delta);
    const o = THREE.MathUtils.lerp(g.scale.x, active ? 1 : 0.001, k);
    g.scale.setScalar(o);
    g.visible = o > 0.01;
    g.rotation.y = state.clock.elapsedTime * 0.09;
  });
  return (
    <group ref={group}>
      {qualities.map((q, i) => {
        const a = (i / qualities.length) * Math.PI * 2;
        const r = 6.4;
        return (
          <mesh key={q} position={[Math.cos(a) * r, Math.sin(a * 1.6) * 1.6, Math.sin(a) * r]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#ffd9a0" transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Galaxy({ scene, name, qualities }: Props) {
  const stars = useStarField(5200);
  const group = useRef<THREE.Group>(null);
  const visible = scene >= 3;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-1.6 * delta);
    const cur = (g.userData["o"] as number) ?? 0;
    const o = THREE.MathUtils.lerp(cur, visible ? 1 : 0, k);
    g.userData["o"] = o;
    g.visible = o > 0.01;
    g.rotation.y = state.clock.elapsedTime * 0.02;
    g.rotation.x = 0.22 + Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
    const pts = g.children[0] as THREE.Points | undefined;
    if (pts) {
      const m = pts.material as THREE.PointsMaterial;
      m.opacity = o;
    }
  });

  return (
    <>
      <group ref={group} position={[0, 0, -6]}>
        <points geometry={stars}>
          <pointsMaterial
            size={0.14}
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
      <Constellation name={name} active={scene === 4 || scene === 10} />
      <Orbs qualities={qualities} active={scene === 4} />
      {scene >= 3 && (
        <mesh position={[0, 0, -18]}>
          <planeGeometry args={[70, 40]} />
          <meshBasicMaterial color="#2a1b4d" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
