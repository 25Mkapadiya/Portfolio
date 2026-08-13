'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'

const shelfPosition = new THREE.Vector3()
const readingPosition = new THREE.Vector3()
const tempScale = new THREE.Vector3()
const shelfQuaternion = new THREE.Quaternion()
const readingQuaternion = new THREE.Quaternion()
const shelfEuler = new THREE.Euler()
const readingEuler = new THREE.Euler()
const yAxis = new THREE.Vector3(0, 1, 0)

function smoothUnit(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export default function ProjectBook({
  project,
  index,
  active,
  interactionLocked,
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
  const transition = useRef({ value: active ? 1 : 0 })
  const [hovered, setHovered] = useState(false)
  const previousPage = useRef(pageIndex)

  const { height, width, thickness, color, accent } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const pageTone = project.pages?.[pageIndex]?.tone ?? '#eee7dc'

  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const pageWidth = width * 0.955
  const pageHeight = height * 0.955
  const pageSurfaceZ = pageBlockDepth / 2 + 0.005
  const coverZ = pageBlockDepth / 2 + coverDepth / 2 + 0.008
  const hingeX = -width / 2

  // Keep the open spread large enough to carry real project imagery while
  // scaling unusually tall books down just enough to avoid viewport clipping.
  const readingScale = THREE.MathUtils.clamp(2.9 / height, 1.52, 1.72)

  useEffect(() => {
    gsap.killTweensOf(transition.current)
    gsap.to(transition.current, {
      value: active ? 1 : 0,
      duration: reducedMotion ? 0.2 : active ? 1.22 : 0.92,
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
      duration: reducedMotion ? 0.16 : 0.68,
      ease: 'power2.inOut',
      onComplete: () => {
        if (turningPage.current) turningPage.current.rotation.y = 0
      },
    })

    previousPage.current = pageIndex
  }, [active, pageIndex, pageDirection, reducedMotion])

  useFrame((state, delta) => {
    if (!root.current || !coverPivot.current) return

    const progress = reducedMotion ? (active ? 1 : 0) : transition.current.value
    const travelProgress = smoothUnit(progress / 0.68)
    const coverProgress = smoothUnit((progress - 0.48) / 0.52)

    // The active/returning book owns the shared reader progress. Camera and
    // library use the same value, so none of the systems can race each other.
    if (active || progress > 0.001) {
      scrollState.current.readerProgress = progress
    } else if (scrollState.current.readerProgress < 0.002) {
      scrollState.current.readerProgress = 0
    }

    coverPivot.current.rotation.y = THREE.MathUtils.lerp(0, -Math.PI + 0.075, coverProgress)

    if (progress > 0.001 || active) {
      const parentRotation = scrollState?.current?.libraryRotation ?? 0
      const parentY = scrollState?.current?.libraryY ?? 0

      shelfPosition.set(...transform.position)

      // In reading mode the physical hinge becomes the center of the spread.
      // This target is expressed in the library's local coordinates so the
      // book can travel continuously from its exact shelf position.
      readingPosition.set(width * 0.5 * readingScale, -0.015 - parentY, 3.58)
      readingPosition.applyAxisAngle(yAxis, -parentRotation)

      root.current.position.lerpVectors(shelfPosition, readingPosition, travelProgress)
      tempScale.setScalar(THREE.MathUtils.lerp(1, readingScale, travelProgress))
      root.current.scale.copy(tempScale)

      shelfEuler.set(...transform.rotation)
      readingEuler.set(-0.022, -parentRotation, 0)
      shelfQuaternion.setFromEuler(shelfEuler)
      readingQuaternion.setFromEuler(readingEuler)
      root.current.quaternion.slerpQuaternions(shelfQuaternion, readingQuaternion, travelProgress)
    } else {
      const hoverOffset = hovered && project.interactive ? 0.3 : 0
      shelfPosition.set(
        transform.position[0] + transform.radial[0] * hoverOffset,
        transform.position[1] + (hovered ? 0.025 : 0),
        transform.position[2] + transform.radial[2] * hoverOffset,
      )

      const alpha = 1 - Math.exp(-10 * delta)
      root.current.position.lerp(shelfPosition, alpha)
      tempScale.setScalar(hovered && project.interactive ? 1.025 : 1)
      root.current.scale.lerp(tempScale, alpha)

      shelfEuler.set(...transform.rotation)
      if (hovered && project.interactive && !reducedMotion) shelfEuler.z = -0.018
      shelfQuaternion.setFromEuler(shelfEuler)
      root.current.quaternion.slerp(shelfQuaternion, alpha)

      if (!reducedMotion) {
        root.current.position.y += Math.sin(state.clock.elapsedTime * 0.7 + index * 0.8) * 0.0007
      }
    }
  })

  const handleOver = (event) => {
    event.stopPropagation()
    if (!project.interactive || active || interactionLocked || transition.current.value > 0.01) return
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
    if (!project.interactive || active || interactionLocked || transition.current.value > 0.01) return
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
      <RoundedBox
        args={[width, height, pageBlockDepth]}
        radius={0.012}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#eee7dc" roughness={0.95} />
      </RoundedBox>

      <RoundedBox
        args={[width + coverOverhang, height + coverOverhang, coverDepth]}
        radius={0.006}
        smoothness={2}
        position={[0, 0, -coverZ]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.64} />
      </RoundedBox>

      <RoundedBox
        args={[0.05, height + 0.025, pageBlockDepth + coverDepth * 1.7]}
        radius={0.005}
        smoothness={2}
        position={[hingeX - 0.017, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>

      <mesh
        position={[hingeX - 0.042, height * 0.2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[Math.max(0.08, thickness * 0.58), Math.max(0.16, height * 0.19)]} />
        <meshStandardMaterial color={accent} roughness={0.8} />
      </mesh>

      <mesh position={[0, 0, pageSurfaceZ]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
      </mesh>

      <group ref={coverPivot} position={[hingeX, 0, coverZ]}>
        <RoundedBox
          args={[width + coverOverhang, height + coverOverhang, coverDepth]}
          radius={0.006}
          smoothness={2}
          position={[width / 2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.62} />
        </RoundedBox>

        <mesh position={[width / 2, 0, -coverDepth / 2 - 0.004]} receiveShadow>
          <planeGeometry args={[pageWidth, pageHeight]} />
          <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[width / 2, 0, coverDepth / 2 + 0.003]}>
          <planeGeometry args={[width * 0.58, height * 0.28]} />
          <meshStandardMaterial color={accent} roughness={0.82} />
        </mesh>
      </group>

      {(active || transition.current.value > 0.85) && (
        <>
          <mesh position={[hingeX, 0, pageSurfaceZ + 0.011]}>
            <planeGeometry args={[0.025, pageHeight * 0.92]} />
            <meshStandardMaterial color="#4e463e" transparent opacity={0.13} />
          </mesh>

          <group ref={turningPage} position={[hingeX, 0, pageSurfaceZ + 0.02]}>
            <mesh position={[pageWidth / 2, 0, 0]} castShadow>
              <planeGeometry args={[pageWidth, pageHeight, 24, 1]} />
              <meshStandardMaterial color="#f8f2e9" roughness={0.99} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </>
      )}
    </group>
  )
}
