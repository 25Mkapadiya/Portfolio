'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../../../data/projects'
import { getLibraryMotion } from '../../../lib/spiral'
import CameraRig from './CameraRig'
import SpiralScrollController from './SpiralScrollController'
import Atmosphere from './Atmosphere'
import SpiralBookcase from '../library/SpiralBookcase'
import ReaderBook from '../book/ReaderBook'

export default function ProjectsScene(props) {
  const initialMotion = getLibraryMotion(0, projects.length)
  const scrollState = useRef({
    current: 0,
    target: 0,
    focusIndex: 0,
    lastInput: 0,
    bookCount: projects.length,
    libraryRotation: initialMotion.rotationY,
    libraryY: initialMotion.positionY,
    readerProgress: 0,
  })
  const [readerProject, setReaderProject] = useState(props.activeProject ?? null)

  useEffect(() => {
    if (props.activeProject) setReaderProject(props.activeProject)
  }, [props.activeProject])

  const clearReader = useCallback(() => {
    scrollState.current.readerProgress = 0
    setReaderProject(null)
  }, [])

  const handleFocus = useCallback((index) => {
    props.onHover?.(projects[index] ?? null)
  }, [props.onHover])

  const readerIndex = readerProject ? projects.findIndex((item) => item.id === readerProject.id) : -1
  const readerActive = Boolean(props.activeProject && readerProject?.id === props.activeProject.id)

  return (
    <Canvas
      className="projects-canvas"
      camera={{ position: [0, 0.32, 8.65], fov: 40, near: 0.1, far: 80 }}
      dpr={[1, 1.55]}
      shadows={{ type: THREE.PCFSoftShadowMap }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.03,
      }}
      onPointerMissed={() => props.onHover?.(null)}
    >
      <color attach="background" args={['#d9d2c8']} />
      <fog attach="fog" args={['#d9d2c8', 11.2, 20.4]} />

      <ambientLight intensity={0.48} />
      <hemisphereLight color="#fff8ee" groundColor="#80776f" intensity={0.72} />

      <directionalLight
        position={[-5.8, 8.8, 7.4]}
        intensity={3.15}
        color="#ffeedb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-6.4}
        shadow-camera-right={6.4}
        shadow-camera-top={6.6}
        shadow-camera-bottom={-6.6}
        shadow-bias={-0.00025}
        shadow-normalBias={0.035}
      />

      <spotLight
        position={[5.6, 4.8, -1.8]}
        intensity={0.72}
        color="#e9e2d9"
        angle={0.62}
        penumbra={0.92}
        distance={18}
        decay={1.6}
      />

      <pointLight
        position={[3.4, 0.1, 4.6]}
        intensity={0.34}
        color="#efd2b4"
        distance={10}
        decay={1.75}
      />

      <SpiralScrollController
        scrollState={scrollState}
        activeProject={readerProject}
        reducedMotion={props.reducedMotion}
        onFocus={handleFocus}
      />
      <CameraRig activeProject={props.activeProject} reducedMotion={props.reducedMotion} scrollState={scrollState} />
      <SpiralBookcase {...props} activeProject={readerProject} scrollState={scrollState} />

      {readerProject && readerIndex >= 0 && (
        <ReaderBook
          key={readerProject.id}
          project={readerProject}
          index={readerIndex}
          active={readerActive}
          pageIndex={props.pageIndex}
          pageDirection={props.pageDirection}
          reducedMotion={props.reducedMotion}
          scrollState={scrollState}
          onReturned={clearReader}
        />
      )}

      <Atmosphere reducedMotion={props.reducedMotion} />
      <ContactShadows
        position={[0, -2.65, 0]}
        opacity={0.18}
        scale={10.5}
        blur={2.8}
        far={4.6}
        resolution={512}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.68, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#cec7bd" roughness={1} />
      </mesh>
    </Canvas>
  )
}
