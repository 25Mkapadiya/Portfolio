'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { projects } from '../../../data/projects'
import { getLibraryMotion } from '../../../lib/spiral'
import ProjectBook from '../book/ProjectBook'
import ContinuousSpiralStructure from './ContinuousSpiralStructure'
import DecorativeBooks from './DecorativeBooks'

function smoothUnit(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

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
  const initialMotion = useMemo(() => getLibraryMotion(0, projects.length), [])

  useFrame((state, delta) => {
    if (!group.current) return

    const readerProgress = scrollState.current.readerProgress ?? 0

    if (activeProject || readerProgress > 0.001) {
      // Keep the spiral orientation frozen, but ease the whole environment away
      // from the camera as the selected book extracts. This creates a clean
      // physical lane so surrounding books never pass through the reader book.
      const retreat = smoothUnit(readerProgress / 0.38)
      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        -1.18 * retreat,
        reducedMotion ? 30 : 9,
        delta,
      )

      scrollState.current.libraryRotation = group.current.rotation.y
      scrollState.current.libraryY = group.current.position.y
      return
    }

    const progress = scrollState.current.current
    const motion = getLibraryMotion(progress, projects.length)
    const idleRotation = !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.18) * 0.004
      : 0
    const idleY = !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.34) * 0.012
      : 0

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      motion.rotationY + idleRotation,
      5.4,
      delta,
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      motion.positionY + idleY,
      5.4,
      delta,
    )
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      0,
      reducedMotion ? 30 : 9,
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
      <ContinuousSpiralStructure bookCount={projects.length} />
      <DecorativeBooks bookCount={projects.length} />

      {projects.map((project, index) => (
        <ProjectBook
          key={project.id}
          project={project}
          index={index}
          active={activeProject?.id === project.id}
          interactionLocked={Boolean(activeProject) || (scrollState.current.readerProgress ?? 0) > 0.001}
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
