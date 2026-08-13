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
  const [hovered, setHovered] = useState(false)
  const previousPage = useRef(pageIndex)

  const { height, width, thickness, color, accent } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const pageTone = project.pages?.[pageIndex]?.tone ?? '#eee7dc'

  // One physical book is used in both shelf and reading states. Nothing is
  // swapped when a project is clicked, which removes the visible transition cut.
  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const pageWidth = width * 0.955
  const pageHeight = height * 0.955
  const pageSurfaceZ = pageBlockDepth / 2 + 0.005
  const coverZ = pageBlockDepth / 2 + coverDepth / 2 + 0.008
  const hingeX = -width / 2

  // Keep every project visually large while preventing unusually tall books
  // from clipping vertically. Yale fills most of the viewport; taller books
  // automatically scale down just enough to remain usable.
  const readingScale = THREE.MathUtils.clamp(2.72 / height, 1.43, 1.62)

  useEffect(() => {
    if (!coverPivot.current) return

    const pivot = coverPivot.current.rotation
    gsap.killTweensOf(pivot)

    gsap.to(pivot, {
      y: active ? -Math.PI + 0.075 : 0,
      duration: reducedMotion ? 0.18 : active ? 0.92 : 0.58,
      // Let the intact closed book leave the shelf and arrive in front of the
      // camera before the cover starts opening.
      delay: active && !reducedMotion ? 0.58 : 0,
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
    if (!root.current) return

    // Extraction is intentionally slower than hover movement. The book should
    // feel like it physically leaves the shelf before it becomes a reader.
    const damping = reducedMotion ? 18 : active ? 5.6 : 10
    const alpha = 1 - Math.exp(-damping * delta)

    if (active) {
      const parentRotation = scrollState?.current?.libraryRotation ?? 0
      const parentY = scrollState?.current?.libraryY ?? 0

      // When the cover opens, the hinge becomes the center of the two-page
      // spread. Shift the closed book gradually so that same hinge lands at the
      // center of the viewport without any positional jump.
      tempPosition.set(width * 0.5 * readingScale, -0.01 - parentY, 3.52)
      tempPosition.applyAxisAngle(yAxis, -parentRotation)
      tempScale.setScalar(readingScale)
      targetEuler.set(-0.025, -parentRotation, 0)
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
    if (!project.interactive || active || interactionLocked) return
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
    if (!project.interactive || active || interactionLocked) return
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
      {/* Page block stays identical before, during and after extraction. */}
      <RoundedBox
        args={[width, height, pageBlockDepth]}
        radius={0.012}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#eee7dc" roughness={0.95} />
      </RoundedBox>

      {/* Back cover stays fixed to the page block. */}
      <RoundedBox
        args={[width + coverOverhang, height + coverOverhang, coverDepth]}
        radius={0.006}
        smoothness={2}
        position={[0, 0, -coverZ]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.64} />
      </RoundedBox>

      {/* Narrow spine. */}
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

      {/* Right-hand page surface is already underneath the closed cover. */}
      <mesh position={[0, 0, pageSurfaceZ]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
      </mesh>

      {/* The front cover is the same object seen on the shelf. Its inside page
          surface is attached to it and only becomes visible naturally as the
          cover swings around the spine. */}
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

      {active && (
        <>
          {/* Subtle gutter shadow, intentionally very narrow. */}
          <mesh position={[hingeX, 0, pageSurfaceZ + 0.011]}>
            <planeGeometry args={[0.025, pageHeight * 0.92]} />
            <meshStandardMaterial color="#4e463e" transparent opacity={0.13} />
          </mesh>

          {/* Only the currently turning sheet is conditional. It is visually
              identical to the right page until the user actually changes spread. */}
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
