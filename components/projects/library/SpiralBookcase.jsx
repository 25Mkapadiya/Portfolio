'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { projects } from '../../../data/projects'
import { getShelfSegments } from '../../../lib/spiral'
import ProjectBook from '../book/ProjectBook'

export default function SpiralBookcase({
  activeProject,
  hoveredProject,
  pageIndex,
  pageDirection,
  onOpen,
  onHover,
  reducedMotion,
}) {
  const group = useRef()
  const shelves = useMemo(() => getShelfSegments(29), [])

  useFrame((state) => {
    if (!group.current || reducedMotion || activeProject) return
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.025
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.008
  })

  return (
    <group ref={group}>
      {shelves.map((shelf, index) => (
        <RoundedBox
          key={shelf.id}
          args={[1.35, 0.12, 0.72]}
          radius={0.05}
          smoothness={3}
          position={shelf.position}
          rotation={shelf.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={index % 3 === 0 ? '#ded5c5' : '#e9e1d4'} roughness={0.82} metalness={0.02} />
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
        />
      ))}
    </group>
  )
}
