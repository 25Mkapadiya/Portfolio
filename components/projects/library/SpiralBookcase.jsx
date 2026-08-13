'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { projects } from '../../../data/projects'
import { getLibraryMotion } from '../../../lib/spiral'
import ProjectBook from '../book/ProjectBook'
import ContinuousSpiralStructure from './ContinuousSpiralStructure'
import DecorativeBooks from './DecorativeBooks'

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

    // Freeze the library at the exact transform it had when a project was
    // selected, and keep it frozen until the book has fully returned. This
    // prevents the parent transform from moving underneath the transitioning
    // book, which was the source of the visible wobble/jump.
    if (activeProject || readerProgress > 0.001) {
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
