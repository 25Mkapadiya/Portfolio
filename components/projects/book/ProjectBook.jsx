'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'

const targetPosition = new THREE.Vector3()
const targetQuaternion = new THREE.Quaternion()
const targetEuler = new THREE.Euler()

export function ChessCoverArtwork({ width, height, z }) {
  const boardSize = Math.min(width * 0.62, height * 0.39)
  const tile = boardSize / 4
  const boardY = height * 0.1

  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, height * 0.39, 0]}>
        <boxGeometry args={[width * 0.5, 0.018, 0.012]} />
        <meshStandardMaterial color="#d4b16b" roughness={0.72} />
      </mesh>

      <group position={[0, boardY, 0]}>
        {Array.from({ length: 16 }, (_, index) => {
          const row = Math.floor(index / 4)
          const col = index % 4
          const x = (col - 1.5) * tile
          const y = (1.5 - row) * tile
          return (
            <mesh key={index} position={[x, y, 0]}>
              <boxGeometry args={[tile * 0.94, tile * 0.94, 0.012]} />
              <meshStandardMaterial
                color={(row + col) % 2 === 0 ? '#f7f1e7' : '#990000'}
                roughness={0.8}
              />
            </mesh>
          )
        })}
      </group>

      <group position={[0, -height * 0.29, 0]}>
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[width * 0.065, height * 0.14, 0.014]} />
          <meshStandardMaterial color="#d4b16b" roughness={0.68} />
        </mesh>
        <mesh position={[0, height * 0.12, 0]}>
          <boxGeometry args={[width * 0.14, height * 0.018, 0.014]} />
          <meshStandardMaterial color="#d4b16b" roughness={0.68} />
        </mesh>
        <mesh position={[0, height * 0.12, 0]}>
          <boxGeometry args={[width * 0.022, height * 0.09, 0.014]} />
          <meshStandardMaterial color="#d4b16b" roughness={0.68} />
        </mesh>
        <mesh position={[0, -height * 0.05, 0]}>
          <boxGeometry args={[width * 0.18, height * 0.024, 0.014]} />
          <meshStandardMaterial color="#d4b16b" roughness={0.68} />
        </mesh>
      </group>
    </group>
  )
}

export function ChessSpineArtwork({ x, height, thickness }) {
  const segmentHeight = height * 0.075
  const segmentWidth = Math.min(0.085, thickness * 0.3)

  return (
    <group position={[x, 0, 0]}>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh key={index} position={[0, height * 0.22 - index * segmentHeight * 1.02, 0]}>
          <boxGeometry args={[0.011, segmentHeight * 0.86, segmentWidth]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#f7f1e7' : '#990000'}
            roughness={0.8}
          />
        </mesh>
      ))}
      <mesh position={[0, -height * 0.28, 0]}>
        <boxGeometry args={[0.012, height * 0.18, Math.min(0.04, thickness * 0.18)]} />
        <meshStandardMaterial color="#d4b16b" roughness={0.72} />
      </mesh>
    </group>
  )
}

export default function ProjectBook({ project, index, active, hidden, interactionLocked, onOpen, onHover, reducedMotion }) {
  const root = useRef()
  const [hovered, setHovered] = useState(false)
  const { height, width, thickness, color, accent, theme } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const coverZ = pageBlockDepth / 2 + coverDepth / 2 + 0.008
  const hingeX = -width / 2
  const unavailable = Boolean(hidden || active)

  useFrame((_, delta) => {
    if (!root.current) return
    targetPosition.set(...transform.position)
    targetEuler.set(...transform.rotation)
    targetQuaternion.setFromEuler(targetEuler)
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-13 * delta)
    root.current.position.lerp(targetPosition, alpha)
    root.current.scale.setScalar(1)
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
    <group
      ref={root}
      visible={!unavailable}
      position={transform.position}
      rotation={transform.rotation}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <RoundedBox args={[width, height, pageBlockDepth]} radius={0.012} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color={project.book.paper ?? '#eee7dc'} roughness={0.95} />
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

      {theme === 'chess' ? (
        <>
          <ChessCoverArtwork width={width} height={height} z={coverZ + coverDepth / 2 + 0.008} />
          <ChessSpineArtwork x={hingeX - 0.045} height={height} thickness={thickness} />
        </>
      ) : (
        <mesh position={[hingeX - 0.042, height * 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[Math.max(0.08, thickness * 0.58), Math.max(0.16, height * 0.19)]} />
          <meshStandardMaterial color={accent} roughness={0.8} />
        </mesh>
      )}
    </group>
  )
}
