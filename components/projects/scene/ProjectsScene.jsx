'use client'

import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import CameraRig from './CameraRig'
import Atmosphere from './Atmosphere'
import SpiralBookcase from '../library/SpiralBookcase'

export default function ProjectsScene(props) {
  return (
    <Canvas
      className="projects-canvas"
      camera={{ position: [0, 0.45, 8.45], fov: 40, near: 0.1, far: 80 }}
      dpr={[1, 1.55]}
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => props.onHover?.(null)}
    >
      <color attach="background" args={['#dcd4c8']} />
      <fog attach="fog" args={['#dcd4c8', 10, 19]} />

      <ambientLight intensity={1.45} />
      <hemisphereLight color="#fff9ef" groundColor="#7d746a" intensity={1.35} />
      <directionalLight
        position={[-4.5, 8, 7]}
        intensity={3.1}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <pointLight position={[5, 1.5, 4]} intensity={1.3} color="#f0d6c2" />

      <CameraRig activeProject={props.activeProject} reducedMotion={props.reducedMotion} />
      <SpiralBookcase {...props} />
      <Atmosphere reducedMotion={props.reducedMotion} />

      <ContactShadows
        position={[0, -2.65, 0]}
        opacity={0.2}
        scale={10}
        blur={2.8}
        far={4.5}
        resolution={512}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.68, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#d4ccbf" roughness={1} />
      </mesh>
    </Canvas>
  )
}
