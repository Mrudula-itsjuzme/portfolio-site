import { Canvas } from "@react-three/fiber";

function Orb({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.18, 14, 14]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
    </mesh>
  );
}

export default function LibraryLights() {
  return (
    <div className="lights-layer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[-2, 2, 2]} intensity={0.9} color="#ffdfb0" />
        <pointLight position={[2, 1, 3]} intensity={0.5} color="#d6b67b" />
        <Orb position={[-2, 1.4, 0]} color="#8b6e49" />
        <Orb position={[1.8, 0.6, -0.3]} color="#70553a" />
      </Canvas>
    </div>
  );
}
