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
  const leftLeafPivot = useRef()
  const turningPage = useRef()
  const [hovered, setHovered] = useState(false)
  const previousPage = useRef(pageIndex)

  const { height, width, thickness, color, accent } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const pageTone = project.pages?.[pageIndex]?.tone ?? '#eee7dc'

  const coverDepth = 0.04
  const coverOverhang = 0.034
  const readingScale = 1.4

  const pageWidth = width * 0.94
  const pageHeight = height * 0.95
  const gutter = 0.042
  const stackDepth = Math.max(0.052, thickness * 0.2)
  const pageCenterX = gutter / 2 + pageWidth / 2
  const surfaceZ = stackDepth / 2 + 0.009

  useEffect(() => {
    if (!active || !leftLeafPivot.current) return

    const pivot = leftLeafPivot.current.rotation
    gsap.killTweensOf(pivot)
    pivot.y = 0
    gsap.to(pivot, {
      // The complete left leaf rotates around one narrow center hinge. The
      // cover and left page block therefore always keep believable proportions.
      y: -Math.PI + 0.035,
      duration: reducedMotion ? 0.18 : 0.92,
      delay: reducedMotion ? 0 : 0.24,
      ease: 'power3.inOut',
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
    const damping = reducedMotion ? 18 : active ? 7.5 : 10
    const alpha = 1 - Math.exp(-damping * delta)

    if (active) {
      const parentRotation = scrollState?.current?.libraryRotation ?? 0
      const parentY = scrollState?.current?.libraryY ?? 0

      // The open book is centered on its gutter. It is deliberately closer and
      // larger than before, but still leaves enough margin for the tallest book.
      tempPosition.set(0, -0.02 - parentY, 3.34)
      tempPosition.applyAxisAngle(yAxis, -parentRotation)
      tempScale.setScalar(readingScale)
      targetEuler.set(-0.035, -parentRotation, 0)
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
      {!active ? (
        <>
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
            args={[width + coverOverhang, height + coverOverhang, coverDepth]}
            radius={0.007}
            smoothness={2}
            position={[0, 0, thickness / 2 + 0.024]}
            castShadow
          >
            <meshStandardMaterial color={color} roughness={0.62} />
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
        </>
      ) : (
        <group>
          {/* RIGHT SIDE: back cover + page block are fixed. */}
          <RoundedBox
            args={[pageWidth + coverOverhang, pageHeight + coverOverhang, coverDepth]}
            radius={0.007}
            smoothness={2}
            position={[pageCenterX, 0, -stackDepth / 2 - coverDepth * 0.72]}
            castShadow
          >
            <meshStandardMaterial color={color} roughness={0.64} />
          </RoundedBox>

          <RoundedBox
            args={[pageWidth, pageHeight, stackDepth]}
            radius={0.011}
            smoothness={2}
            position={[pageCenterX, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#eee7dc" roughness={0.96} />
          </RoundedBox>

          <mesh position={[pageCenterX, 0, surfaceZ]} receiveShadow>
            <planeGeometry args={[pageWidth * 0.95, pageHeight * 0.95]} />
            <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
          </mesh>

          {/* LEFT SIDE: the page block and front cover are one leaf. When
              closed they sit over the right pages; when opened they rotate as
              one object around the center gutter. */}
          <group ref={leftLeafPivot} position={[0, 0, 0]}>
            <RoundedBox
              args={[pageWidth, pageHeight, stackDepth]}
              radius={0.011}
              smoothness={2}
              position={[pageCenterX, 0, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#eee7dc" roughness={0.96} />
            </RoundedBox>

            <RoundedBox
              args={[pageWidth + coverOverhang, pageHeight + coverOverhang, coverDepth]}
              radius={0.007}
              smoothness={2}
              position={[pageCenterX, 0, stackDepth / 2 + coverDepth * 0.72]}
              castShadow
            >
              <meshStandardMaterial color={color} roughness={0.62} />
            </RoundedBox>

            {/* This is the inside surface of the left page. It begins hidden
                while closed and faces the camera after the leaf opens. */}
            <mesh position={[pageCenterX, 0, -surfaceZ]} receiveShadow>
              <planeGeometry args={[pageWidth * 0.95, pageHeight * 0.95]} />
              <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Narrow cloth/gutter strip. The old hinge was visually much too
              thick; this keeps the center proportional to an actual hardcover. */}
          <RoundedBox
            args={[gutter * 0.72, pageHeight * 0.965, 0.026]}
            radius={0.005}
            smoothness={2}
            position={[0, 0, -0.012]}
          >
            <meshStandardMaterial color={color} roughness={0.82} />
          </RoundedBox>

          <mesh position={[0, 0, surfaceZ + 0.014]}>
            <planeGeometry args={[gutter * 1.35, pageHeight * 0.91]} />
            <meshStandardMaterial color="#4e463e" transparent opacity={0.13} />
          </mesh>

          {/* Page turn originates from the inside edge of the right page. */}
          <group ref={turningPage} position={[gutter / 2, 0, surfaceZ + 0.022]}>
            <mesh position={[pageWidth / 2, 0, 0]} castShadow>
              <planeGeometry args={[pageWidth * 0.96, pageHeight * 0.94, 24, 1]} />
              <meshStandardMaterial color="#f8f2e9" roughness={0.99} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  )
}
