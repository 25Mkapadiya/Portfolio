'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'
import { ChessCoverArtwork, ChessSpineArtwork } from './ProjectBook'

const yAxis = new THREE.Vector3(0, 1, 0)
const extractPosition = new THREE.Vector3()
const endPosition = new THREE.Vector3()
const currentPosition = new THREE.Vector3()
const endQuaternion = new THREE.Quaternion()
const currentQuaternion = new THREE.Quaternion()
const endEuler = new THREE.Euler()

function smoothUnit(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export default function ReaderBook({ project, index, active, pageIndex, pageDirection, reducedMotion, scrollState, onReturned }) {
  const root = useRef()
  const leftLeaf = useRef()
  const turningPage = useRef()
  const progressRef = useRef(0)
  const previousPage = useRef(pageIndex)
  const returnedNotified = useRef(false)

  const { height, width, thickness, color, accent, paper, theme } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const rightStackDepth = pageBlockDepth * 0.52
  const leftStackDepth = pageBlockDepth - rightStackDepth
  const rightStackCenterZ = -pageBlockDepth / 2 + rightStackDepth / 2
  const leftStackCenterZ = pageBlockDepth / 2 - leftStackDepth / 2
  const coverZ = pageBlockDepth / 2 + coverDepth / 2 + 0.008
  const pageWidth = width * 0.955
  const pageHeight = height * 0.955
  const hingeX = -width / 2
  const readingScale = theme === 'chess' ? 1.4 : THREE.MathUtils.clamp(2.55 / height, 1.34, 1.5)

  const captured = useRef(null)
  if (!captured.current) {
    const libraryRotation = scrollState.current.libraryRotation ?? 0
    const libraryY = scrollState.current.libraryY ?? 0
    const position = new THREE.Vector3(...transform.position)
    position.applyAxisAngle(yAxis, libraryRotation)
    position.y += libraryY

    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(transform.rotation[0], transform.rotation[1] + libraryRotation, transform.rotation[2]),
    )

    const radial = new THREE.Vector3(transform.radial[0], 0, transform.radial[2])
      .applyAxisAngle(yAxis, libraryRotation)
      .normalize()

    captured.current = { position, quaternion, radial }
  }

  useLayoutEffect(() => {
    progressRef.current = 0
    returnedNotified.current = false
    previousPage.current = 0
    scrollState.current.readerProgress = 0

    if (root.current) {
      root.current.position.copy(captured.current.position)
      root.current.quaternion.copy(captured.current.quaternion)
      root.current.scale.setScalar(1)
    }
    if (leftLeaf.current) leftLeaf.current.rotation.y = 0
    if (turningPage.current) turningPage.current.visible = false
  }, [project.id, scrollState])

  useEffect(() => {
    if (active) returnedNotified.current = false
  }, [active])

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
      duration: reducedMotion ? 0.14 : 0.58,
      ease: 'power2.inOut',
      onComplete: () => {
        if (turningPage.current) turningPage.current.rotation.y = 0
      },
    })
    previousPage.current = pageIndex
  }, [active, pageIndex, pageDirection, reducedMotion])

  useFrame((_, delta) => {
    if (!root.current || !leftLeaf.current || !captured.current) return

    const duration = active ? 1.18 : 0.94
    const direction = active ? 1 : -1
    progressRef.current = reducedMotion
      ? (active ? 1 : 0)
      : THREE.MathUtils.clamp(progressRef.current + direction * (delta / duration), 0, 1)

    const p = progressRef.current
    const extract = smoothUnit(p / 0.28)
    const focus = smoothUnit((p - 0.2) / 0.5)
    const open = smoothUnit((p - 0.72) / 0.28)
    scrollState.current.readerProgress = p

    extractPosition
      .copy(captured.current.position)
      .addScaledVector(captured.current.radial, 0.72)

    currentPosition.lerpVectors(captured.current.position, extractPosition, extract)
    endPosition.set(width * 0.5 * readingScale, -0.015, 3.46)
    currentPosition.lerp(endPosition, focus)
    root.current.position.copy(currentPosition)

    endEuler.set(-0.025, 0, 0)
    endQuaternion.setFromEuler(endEuler)
    currentQuaternion.slerpQuaternions(captured.current.quaternion, endQuaternion, focus)
    root.current.quaternion.copy(currentQuaternion)
    root.current.scale.setScalar(THREE.MathUtils.lerp(1, readingScale, focus))

    const openAngle = theme === 'chess' ? -Math.PI + 0.18 : -Math.PI + 0.2
    leftLeaf.current.rotation.y = THREE.MathUtils.lerp(0, openAngle, open)

    if (turningPage.current) turningPage.current.visible = open > 0.985

    if (!active && p === 0 && !returnedNotified.current) {
      returnedNotified.current = true
      onReturned?.()
    }
  })

  const pageTone = project.pages?.[pageIndex]?.tone ?? paper ?? '#eee7dc'
  const pagePaper = paper ?? '#eee7dc'

  return (
    <group ref={root} position={captured.current.position} quaternion={captured.current.quaternion}>
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
        args={[width, height, rightStackDepth]}
        radius={0.009}
        smoothness={2}
        position={[0, 0, rightStackCenterZ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={pagePaper} roughness={0.96} />
      </RoundedBox>
      <mesh position={[0, 0, rightStackCenterZ + rightStackDepth / 2 + 0.006]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
      </mesh>

      <group ref={leftLeaf} position={[hingeX, 0, 0]}>
        <RoundedBox
          args={[width, height, leftStackDepth]}
          radius={0.009}
          smoothness={2}
          position={[width / 2, 0, leftStackCenterZ]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={pagePaper} roughness={0.96} />
        </RoundedBox>
        <mesh position={[width / 2, 0, leftStackCenterZ - leftStackDepth / 2 - 0.006]} receiveShadow>
          <planeGeometry args={[pageWidth, pageHeight]} />
          <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
        </mesh>
        <RoundedBox
          args={[width + coverOverhang, height + coverOverhang, coverDepth]}
          radius={0.006}
          smoothness={2}
          position={[width / 2, 0, coverZ]}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.62} />
        </RoundedBox>

        {theme === 'chess' && (
          <group position={[width / 2, 0, 0]}>
            <ChessCoverArtwork
              width={width}
              height={height}
              z={coverZ + coverDepth / 2 + 0.008}
            />
          </group>
        )}
      </group>

      <RoundedBox
        args={[0.05, height + 0.025, pageBlockDepth + coverDepth * 1.7]}
        radius={0.005}
        smoothness={2}
        position={[hingeX - 0.017, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>

      {theme === 'chess' ? (
        <ChessSpineArtwork x={hingeX - 0.045} height={height} thickness={thickness} />
      ) : (
        <mesh position={[hingeX - 0.042, height * 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[Math.max(0.08, thickness * 0.58), Math.max(0.16, height * 0.19)]} />
          <meshStandardMaterial color={accent} roughness={0.8} />
        </mesh>
      )}

      <group ref={turningPage} position={[hingeX, 0, rightStackCenterZ + rightStackDepth / 2 + 0.02]}>
        <mesh position={[pageWidth / 2, 0, 0]} castShadow>
          <planeGeometry args={[pageWidth, pageHeight, 24, 1]} />
          <meshStandardMaterial color={pagePaper} roughness={0.99} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
