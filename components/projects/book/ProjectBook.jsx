'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { getSpiralTransform } from '../../../lib/spiral'

const tempPosition = new THREE.Vector3()
const tempScale = new THREE.Vector3()
const tempQuaternion = new THREE.Quaternion()
const targetEuler = new THREE.Euler()

export default function ProjectBook({
  project,
  index,
  active,
  pageIndex,
  pageDirection,
  onOpen,
  onHover,
  reducedMotion,
}) {
  const root = useRef()
  const coverPivot = useRef()
  const turningPage = useRef()
  const [hovered, setHovered] = useState(false)
  const previousPage = useRef(pageIndex)

  const transform = useMemo(() => getSpiralTransform(index), [index])
  const { height, width, thickness, color, accent } = project.book
  const pageTone = project.pages?.[pageIndex]?.tone ?? '#eee7dc'

  useEffect(() => {
    if (!coverPivot.current) return
    gsap.killTweensOf(coverPivot.current.rotation)
    gsap.to(coverPivot.current.rotation, {
      y: active ? -2.48 : 0,
      duration: reducedMotion ? 0.18 : active ? 1.05 : 0.72,
      delay: active && !reducedMotion ? 0.34 : 0,
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
      duration: reducedMotion ? 0.16 : 0.72,
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
      tempPosition.set(0, 0.08, 3.55)
      tempScale.setScalar(1.48)
      targetEuler.set(0, 0, 0)
    } else {
      const hoverOffset = hovered && project.interactive ? 0.22 : 0
      tempPosition.set(
        transform.position[0] + transform.radial[0] * hoverOffset,
        transform.position[1] + (hovered ? 0.025 : 0),
        transform.position[2] + transform.radial[2] * hoverOffset,
      )
      tempScale.setScalar(hovered && project.interactive ? 1.035 : 1)
      targetEuler.set(...transform.rotation)
      if (hovered && project.interactive && !reducedMotion) targetEuler.x = -0.035
    }

    root.current.position.lerp(tempPosition, alpha)
    root.current.scale.lerp(tempScale, alpha)
    tempQuaternion.setFromEuler(targetEuler)
    root.current.quaternion.slerp(tempQuaternion, alpha)

    if (!active && !reducedMotion) {
      root.current.position.y += Math.sin(state.clock.elapsedTime * 0.7 + index * 0.8) * 0.0012
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
      <RoundedBox args={[width, height, thickness]} radius={0.045} smoothness={3} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={pageTone} roughness={0.9} />
      </RoundedBox>

      <RoundedBox args={[width + 0.055, height + 0.055, 0.055]} radius={0.045} smoothness={3} position={[0, 0, -thickness / 2 - 0.03]} castShadow>
        <meshStandardMaterial color={color} roughness={0.62} />
      </RoundedBox>

      <RoundedBox args={[0.075, height + 0.04, thickness + 0.08]} radius={0.025} smoothness={3} position={[-width / 2 - 0.025, 0, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.68} />
      </RoundedBox>

      <group ref={coverPivot} position={[-width / 2, 0, thickness / 2 + 0.032]}>
        <RoundedBox args={[width + 0.055, height + 0.055, 0.055]} radius={0.045} smoothness={3} position={[width / 2, 0, 0]} castShadow>
          <meshStandardMaterial color={color} roughness={0.6} />
        </RoundedBox>
        <mesh position={[width * 0.5, 0, 0.032]}>
          <planeGeometry args={[width * 0.62, height * 0.32]} />
          <meshStandardMaterial color={accent} roughness={0.8} />
        </mesh>
      </group>

      {active && (
        <group position={[0, 0, thickness / 2 + 0.06]}>
          <mesh position={[-width * 0.49, 0, 0]} receiveShadow>
            <planeGeometry args={[width * 0.94, height * 0.94]} />
            <meshStandardMaterial color={pageTone} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[width * 0.49, 0, 0.002]} receiveShadow>
            <planeGeometry args={[width * 0.94, height * 0.94]} />
            <meshStandardMaterial color={pageTone} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>

          <group ref={turningPage} position={[0, 0, 0.015]}>
            <mesh position={[width * 0.48, 0, 0]} castShadow>
              <planeGeometry args={[width * 0.94, height * 0.93, 18, 1]} />
              <meshStandardMaterial color="#f7f1e8" roughness={0.96} side={THREE.DoubleSide} />
            </mesh>
          </group>

          <mesh position={[0, 0, 0.026]}>
            <planeGeometry args={[0.018, height * 0.92]} />
            <meshStandardMaterial color="#c9bfae" transparent opacity={0.45} />
          </mesh>
        </group>
      )}
    </group>
  )
}
