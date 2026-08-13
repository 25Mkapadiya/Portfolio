'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'

const tempPosition = new THREE.Vector3()
const tempScale = new THREE.Vector3()
const tempQuaternion = new THREE.Quaternion()
const targetEuler = new THREE.Euler()
const yAxis = new THREE.Vector3(0, 1, 0)

export default function ProjectBook({
  project,
  index,
  active,
  pageIndex,
  pageDirection,
  onOpen,
  onHover,
  reducedMotion,
  scrollState,
}) {
  const root = useRef()
  const coverPivot = useRef()
  const turningPage = useRef()
  const [hovered, setHovered] = useState(false)
  const previousPage = useRef(pageIndex)

  const { height, width, thickness, color, accent } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const pageTone = project.pages?.[pageIndex]?.tone ?? '#eee7dc'
  const coverDepth = 0.042
  const coverOverhang = 0.034
  const readingScale = 1.18
  const pageZ = thickness / 2 + 0.05

  useEffect(() => {
    if (!coverPivot.current) return
    gsap.killTweensOf(coverPivot.current.rotation)
    gsap.to(coverPivot.current.rotation, {
      // Open nearly flat around the true spine instead of stopping at a steep
      // angle that leaves the cover hanging in front of the spread.
      y: active ? -Math.PI + 0.06 : 0,
      duration: reducedMotion ? 0.18 : active ? 0.95 : 0.68,
      delay: active && !reducedMotion ? 0.38 : 0,
      ease: active ? 'power3.inOut' : 'power2.inOut',
    })
  }, [active, reducedMotion])

  useEffect(() => {
    if (!active || !turningPage.current || previousPage.current === pageIndex) {
      previousPage.current = pageIndex
      return
    }

    const direction = pageDirection || (pageIndex > previousPage.current ? 1 : -1)
    const page = turningPage.current.rotation
    gsap.killTweensOf(page)
    page.y = direction > 0 ? 0 : -Math.PI

    gsap.to(page, {
      y: direction > 0 ? -Math.PI : 0,
      duration: reducedMotion ? 0.16 : 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        if (turningPage.current) turningPage.current.rotation.y = 0
      },
    })

    previousPage.current = pageIndex
  }, [active, pageIndex, pageDirection, reducedMotion])

  useFrame((state, delta) => {
    if (!root.current) return
    const damping = reducedMotion ? 18 : active ? 7 : 10
    const alpha = 1 - Math.exp(-damping * delta)

    if (active) {
      const parentRotation = scrollState?.current?.libraryRotation ?? 0
      const parentY = scrollState?.current?.libraryY ?? 0

      // In the open state the spread extends one page-width to the left of the
      // closed book. Shift the root right by half a page so the complete spread
      // is visually centered in the viewport.
      tempPosition.set(width * 0.5 * readingScale, 0.0 - parentY, 3.32)
      tempPosition.applyAxisAngle(yAxis, -parentRotation)
      tempScale.setScalar(readingScale)
      targetEuler.set(0, -parentRotation, 0)
    } else {
      const hoverOffset = hovered && project.interactive ? 0.3 : 0
      tempPosition.set(
        transform.position[0] + transform.radial[0] * hoverOffset,
        transform.position[1] + (hovered ? 0.025 : 0),
        transform.position[2] + transform.radial[2] * hoverOffset,
      )
      tempScale.setScalar(hovered && project.interactive ? 1.025 : 1)
      targetEuler.set(...transform.rotation)
      if (hovered && project.interactive && !reducedMotion) targetEuler.z = -0.018
    }

    root.current.position.lerp(tempPosition, alpha)
    root.current.scale.lerp(tempScale, alpha)
    tempQuaternion.setFromEuler(targetEuler)
    root.current.quaternion.slerp(tempQuaternion, alpha)

    if (!active && !reducedMotion) {
      root.current.position.y += Math.sin(state.clock.elapsedTime * 0.7 + index * 0.8) * 0.0007
    }
  })

  const handleOver = (event) => {
    event.stopPropagation()
    if (!project.interactive || active) return
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
    if (!project.interactive || active) return
    setHovered(false)
    onHover?.(null)
    document.body.dataset.cursor = ''
    onOpen(project)
  }

  return (
    <group
      ref={root}
      position={transform.position}
      rotation={transform.rotation}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      {/* Closed book / right-hand page block. */}
      <RoundedBox
        args={[width, height, Math.max(0.07, thickness - 0.055)]}
        radius={0.014}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={pageTone} roughness={0.93} />
      </RoundedBox>

      <RoundedBox
        args={[width + coverOverhang, height + coverOverhang, coverDepth]}
        radius={0.007}
        smoothness={2}
        position={[0, 0, -thickness / 2 - 0.024]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.64} />
      </RoundedBox>

      <RoundedBox
        args={[0.052, height + 0.025, thickness + 0.05]}
        radius={0.006}
        smoothness={2}
        position={[-width / 2 - 0.017, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.69} />
      </RoundedBox>

      <mesh
        position={[-width / 2 - 0.044, height * 0.2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[Math.max(0.08, thickness * 0.58), Math.max(0.16, height * 0.19)]} />
        <meshStandardMaterial color={accent} roughness={0.8} />
      </mesh>

      {/* True hinge at the physical spine: x = -width / 2. */}
      <group ref={coverPivot} position={[-width / 2, 0, thickness / 2 + 0.024]}>
        <RoundedBox
          args={[width + coverOverhang, height + coverOverhang, coverDepth]}
          radius={0.007}
          smoothness={2}
          position={[width / 2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.62} />
        </RoundedBox>
        <mesh position={[width * 0.5, 0, coverDepth * 0.52]}>
          <planeGeometry args={[width * 0.58, height * 0.28]} />
          <meshStandardMaterial color={accent} roughness={0.82} />
        </mesh>
      </group>

      {active && (
        <group>
          {/* Left page stack is one full page-width left of the closed block,
              so its right edge meets the physical spine. */}
          <RoundedBox
            args={[width * 0.985, height * 0.985, Math.max(0.055, thickness * 0.34)]}
            radius={0.012}
            smoothness={2}
            position={[-width, 0, 0.01]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#eee7dc" roughness={0.95} />
          </RoundedBox>

          <mesh position={[-width, 0, pageZ + 0.006]} receiveShadow>
            <planeGeometry args={[width * 0.92, height * 0.93]} />
            <meshStandardMaterial color={pageTone} roughness={0.98} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, pageZ + 0.008]} receiveShadow>
            <planeGeometry args={[width * 0.92, height * 0.93]} />
            <meshStandardMaterial color={pageTone} roughness={0.98} side={THREE.DoubleSide} />
          </mesh>

          {/* Turning page shares the same spine. */}
          <group ref={turningPage} position={[-width / 2, 0, pageZ + 0.022]}>
            <mesh position={[width / 2, 0, 0]} castShadow>
              <planeGeometry args={[width * 0.92, height * 0.92, 20, 1]} />
              <meshStandardMaterial color="#f7f1e8" roughness={0.98} side={THREE.DoubleSide} />
            </mesh>
          </group>

          <mesh position={[-width / 2, 0, pageZ + 0.03]}>
            <planeGeometry args={[0.034, height * 0.9]} />
            <meshStandardMaterial color="#8f857a" transparent opacity={0.22} />
          </mesh>
        </group>
      )}
    </group>
  )
}
