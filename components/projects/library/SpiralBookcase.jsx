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

    const progress = scrollState.current.current
    const motion = getLibraryMotion(progress, projects.length)
    const idleRotation = !activeProject && !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.18) * 0.004
      : 0
    const idleY = !activeProject && !reducedMotion
      ? Math.sin(state.clock.elapsedTime * 0.34) * 0.012
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

  const visibleProjects = activeProject
    ? projects.filter((project) => project.id === activeProject.id)
    : projects

  return (
    <group
      ref={group}
      position={[0, initialMotion.positionY, 0]}
      rotation={[0, initialMotion.rotationY, 0]}
    >
      {/* Once a project enters reading mode, remove the surrounding library
          from the composition. The selected book keeps its shelf transform and
          flies forward, but the final spread gets a clean, gallery-like stage. */}
      {!activeProject && <ContinuousSpiralStructure bookCount={projects.length} />}
      {!activeProject && <DecorativeBooks bookCount={projects.length} />}

      {visibleProjects.map((project) => {
        const index = projects.findIndex((item) => item.id === project.id)
        return (
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
        )
      })}
    </group>
  )
}
