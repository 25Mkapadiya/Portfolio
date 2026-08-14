'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
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
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => props.onHover?.(null)}
    >
      <color attach="background" args={['#d8d0c4']} />
      <fog attach="fog" args={['#d8d0c4', 10.5, 19.5]} />

      <ambientLight intensity={0.78} />
      <hemisphereLight color="#fff8ec" groundColor="#756b61" intensity={0.88} />

      <directionalLight
        position={[-5.4, 8.4, 6.8]}
        intensity={3.55}
        color="#fff0dd"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.00035}
      />

      <spotLight
        position={[5.2, 5.8, 5.4]}
        intensity={1.15}
        color="#f6ddc3"
        angle={0.52}
        penumbra={0.82}
        distance={18}
        decay={1.45}
      />

      <pointLight position={[-4.6, 0.8, -2.4]} intensity={0.48} color="#d8d1c8" distance={12} decay={1.5} />
      <pointLight position={[4.2, -0.4, 3.6]} intensity={0.62} color="#efcfae" distance={10} decay={1.6} />

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
      <ContactShadows position={[0, -2.65, 0]} opacity={0.28} scale={10.5} blur={2.45} far={4.8} resolution={512} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.68, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#cec5b8" roughness={1} />
      </mesh>
    </Canvas>
  )
}
