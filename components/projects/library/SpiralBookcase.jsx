'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../../../data/projects'
import { getLibraryMotion, getShelfSegments, SPIRAL } from '../../../lib/spiral'
import ProjectBook from '../book/ProjectBook'

export default function SpiralBookcase({
  activeProject,
  hoveredProject,
  pageIndex,
  pageDirection,
  onOpen,
  onHover,
  reducedMotion,
  scrollState,
}) {
  const group = useRef()
  const shelves = useMemo(() => getShelfSegments(projects.length), [])
  const initialMotion = useMemo(() => getLibraryMotion(0, projects.length), [])

  useFrame((state, delta) => {
    if (!group.current) return

    const progress = scrollState.current.current
    const motion = getLibraryMotion(progress, projects.length)
    const idleRotation = !activeProject && !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.18) * 0.005
      : 0
    const idleY = !activeProject && !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.34) * 0.018
      : 0

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      motion.rotationY + idleRotation,
      activeProject ? 6.5 : 5.4,
      delta,
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      motion.positionY + idleY,
      activeProject ? 6.5 : 5.4,
      delta,
    )

    scrollState.current.libraryRotation = group.current.rotation.y
    scrollState.current.libraryY = group.current.position.y
  })

  return (
    <group
      ref={group}
      position={[0, initialMotion.positionY, 0]}
      rotation={[0, initialMotion.rotationY, 0]}
    >
      {shelves.map((shelf, index) => (
        <RoundedBox
          key={shelf.id}
          args={[SPIRAL.shelfWidth, SPIRAL.shelfThickness, SPIRAL.shelfDepth]}
          radius={0.045}
          smoothness={3}
          position={shelf.position}
          rotation={shelf.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={index % 3 === 0 ? '#ded5c5' : '#e9e1d4'}
            roughness={0.82}
            metalness={0.02}
          />
        </RoundedBox>
      ))}

      {projects.map((project, index) => (
        <ProjectBook
          key={project.id}
          project={project}
          index={index}
          active={activeProject?.id === project.id}
          hovered={hoveredProject?.id === project.id}
          pageIndex={activeProject?.id === project.id ? pageIndex : 0}
          pageDirection={pageDirection}
          onOpen={onOpen}
          onHover={onHover}
          reducedMotion={reducedMotion}
          scrollState={scrollState}
        />
      ))}
    </group>
  )
}
