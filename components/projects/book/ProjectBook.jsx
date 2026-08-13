'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'

const targetPosition = new THREE.Vector3()
const targetScale = new THREE.Vector3()
const targetQuaternion = new THREE.Quaternion()
const targetEuler = new THREE.Euler()

export default function ProjectBook({ project, index, active, hidden, interactionLocked, onOpen, onHover, reducedMotion }) {
  const root = useRef()
  const [hovered, setHovered] = useState(false)
  const { height, width, thickness, color, accent } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const coverZ = pageBlockDepth / 2 + coverDepth / 2 + 0.008
  const hingeX = -width / 2
  const unavailable = Boolean(hidden || active)

  useFrame((_, delta) => {
    if (!root.current) return
    const hoverOffset = hovered && project.interactive && !interactionLocked ? 0.18 : 0
    targetPosition.set(
      transform.position[0] + transform.radial[0] * hoverOffset,
      transform.position[1],
      transform.position[2] + transform.radial[2] * hoverOffset,
    )
    targetScale.setScalar(hovered && project.interactive && !interactionLocked ? 1.018 : 1)
    targetEuler.set(...transform.rotation)
    targetQuaternion.setFromEuler(targetEuler)
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-13 * delta)
    root.current.position.lerp(targetPosition, alpha)
    root.current.scale.lerp(targetScale, alpha)
    root.current.quaternion.slerp(targetQuaternion, alpha)
  })

  const handleOver = (event) => {
    event.stopPropagation()
    if (!project.interactive || interactionLocked || unavailable) return
    setHovered(true)
    onHover?.(project)
    document.body.dataset.cursor = 'open'
  }

  const handleOut = (event) => {
    event.stopPropagation()
    setHovered(false)
    onHover?.(null)
    document.body.dataset.cursor = ''
  }

  const handleClick = (event) => {
    event.stopPropagation()
    if (!project.interactive || interactionLocked || unavailable) return
    setHovered(false)
    onHover?.(null)
    document.body.dataset.cursor = ''
    onOpen(project)
  }

  return (
    <group ref={root} visible={!unavailable} position={transform.position} rotation={transform.rotation} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      <RoundedBox args={[width, height, pageBlockDepth]} radius={0.012} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#eee7dc" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[width + coverOverhang, height + coverOverhang, coverDepth]} radius={0.006} smoothness={2} position={[0, 0, -coverZ]} castShadow>
        <meshStandardMaterial color={color} roughness={0.64} />
      </RoundedBox>
      <RoundedBox args={[width + coverOverhang, height + coverOverhang, coverDepth]} radius={0.006} smoothness={2} position={[0, 0, coverZ]} castShadow>
        <meshStandardMaterial color={color} roughness={0.62} />
      </RoundedBox>
      <RoundedBox args={[0.05, height + 0.025, pageBlockDepth + coverDepth * 1.7]} radius={0.005} smoothness={2} position={[hingeX - 0.017, 0, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
      <mesh position={[hingeX - 0.042, height * 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[Math.max(0.08, thickness * 0.58), Math.max(0.16, height * 0.19)]} />
        <meshStandardMaterial color={accent} roughness={0.8} />
      </mesh>
    </group>
  )
}
