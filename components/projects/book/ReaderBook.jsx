'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { getBookTransform } from '../../../lib/spiral'

const yAxis = new THREE.Vector3(0, 1, 0)
const startPosition = new THREE.Vector3()
const endPosition = new THREE.Vector3()
const currentPosition = new THREE.Vector3()
const startQuaternion = new THREE.Quaternion()
const endQuaternion = new THREE.Quaternion()
const currentQuaternion = new THREE.Quaternion()
const endEuler = new THREE.Euler()
const libraryQuaternion = new THREE.Quaternion()

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
  const captured = useRef(null)
  const returnedNotified = useRef(false)

  const { height, width, thickness, color, accent, paper, theme } = project.book
  const transform = useMemo(() => getBookTransform(index, project.book), [index, project.book])
  const coverDepth = 0.038
  const coverOverhang = 0.032
  const pageBlockDepth = Math.max(0.07, thickness - coverDepth * 2 - 0.025)
  const rightStackDepth = pageBlockDepth * 0.54
  const leftStackDepth = pageBlockDepth * 0.26
  const pageWidth = width * 0.955
  const pageHeight = height * 0.955
  const hingeX = -width / 2
  const readingScale = theme === 'chess' ? 1.68 : THREE.MathUtils.clamp(2.8 / height, 1.48, 1.64)

  useEffect(() => {
    const libraryRotation = scrollState.current.libraryRotation ?? 0
    const libraryY = scrollState.current.libraryY ?? 0
    const local = new THREE.Vector3(...transform.position)
    local.applyAxisAngle(yAxis, libraryRotation)
    local.y += libraryY

    const localEuler = new THREE.Euler(...transform.rotation)
    const localQuaternion = new THREE.Quaternion().setFromEuler(localEuler)
    libraryQuaternion.setFromEuler(new THREE.Euler(0, libraryRotation, 0))

    captured.current = {
      position: local.clone(),
      quaternion: libraryQuaternion.clone().multiply(localQuaternion),
    }

    progressRef.current = 0
    returnedNotified.current = false

    if (root.current) {
      root.current.position.copy(captured.current.position)
      root.current.quaternion.copy(captured.current.quaternion)
      root.current.scale.setScalar(1)
    }
    if (leftLeaf.current) leftLeaf.current.rotation.y = 0
    scrollState.current.readerProgress = 0
  }, [project.id, scrollState, transform.position, transform.rotation])

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

    const target = active ? 1 : 0
    const progress = reducedMotion
      ? target
      : THREE.MathUtils.damp(progressRef.current, target, active ? 4.2 : 5.2, delta)

    progressRef.current = Math.abs(progress - target) < 0.0006 ? target : progress
    const p = progressRef.current

    // First settle the selected book into the reading position. Only then open it.
    const travel = smoothUnit(p / 0.76)
    const open = smoothUnit((p - 0.7) / 0.3)
    scrollState.current.readerProgress = p

    startPosition.copy(captured.current.position)
    endPosition.set(width * 0.5 * readingScale, -0.015, 3.48)
    currentPosition.lerpVectors(startPosition, endPosition, travel)
    root.current.position.copy(currentPosition)

    endEuler.set(-0.018, 0, 0)
    endQuaternion.setFromEuler(endEuler)
    currentQuaternion.slerpQuaternions(captured.current.quaternion, endQuaternion, travel)
    root.current.quaternion.copy(currentQuaternion)
    root.current.scale.setScalar(THREE.MathUtils.lerp(1, readingScale, travel))

    const openAngle = theme === 'chess' ? -Math.PI + 0.14 : -Math.PI + 0.16
    leftLeaf.current.rotation.y = THREE.MathUtils.lerp(0, openAngle, open)

    if (!active && p === 0 && !returnedNotified.current) {
      returnedNotified.current = true
      onReturned?.()
    }
  })

  const pageTone = project.pages?.[pageIndex]?.tone ?? paper ?? '#eee7dc'
  const pagePaper = paper ?? '#eee7dc'
  const gutterColor = theme === 'chess' ? accent : color

  return (
    <group ref={root}>
      <RoundedBox args={[width + coverOverhang, height + coverOverhang, coverDepth]} radius={0.006} smoothness={2} position={[0, 0, -pageBlockDepth / 2 - coverDepth * 0.55]} castShadow>
        <meshStandardMaterial color={color} roughness={0.64} />
      </RoundedBox>

      <RoundedBox args={[width, height, rightStackDepth]} radius={0.009} smoothness={2} position={[0, 0, -pageBlockDepth * 0.12]} castShadow receiveShadow>
        <meshStandardMaterial color={pagePaper} roughness={0.96} />
      </RoundedBox>
      <mesh position={[0, 0, rightStackDepth / 2 - pageBlockDepth * 0.12 + 0.006]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
      </mesh>

      <group ref={leftLeaf} position={[hingeX, 0, 0]}>
        <RoundedBox args={[width, height, leftStackDepth]} radius={0.009} smoothness={2} position={[width / 2, 0, pageBlockDepth * 0.15]} castShadow receiveShadow>
          <meshStandardMaterial color={pagePaper} roughness={0.96} />
        </RoundedBox>
        <mesh position={[width / 2, 0, pageBlockDepth * 0.15 - leftStackDepth / 2 - 0.006]} receiveShadow>
          <planeGeometry args={[pageWidth, pageHeight]} />
          <meshStandardMaterial color={pageTone} roughness={0.99} side={THREE.DoubleSide} />
        </mesh>
        <RoundedBox args={[width + coverOverhang, height + coverOverhang, coverDepth]} radius={0.006} smoothness={2} position={[width / 2, 0, pageBlockDepth / 2 + coverDepth * 0.55]} castShadow>
          <meshStandardMaterial color={color} roughness={0.62} />
        </RoundedBox>
      </group>

      <RoundedBox args={[0.032, height + 0.012, pageBlockDepth + coverDepth]} radius={0.003} smoothness={2} position={[hingeX - 0.008, 0, 0]} castShadow>
        <meshStandardMaterial color={gutterColor} roughness={0.72} />
      </RoundedBox>

      <mesh position={[hingeX, 0, rightStackDepth / 2 + 0.012]}>
        <planeGeometry args={[0.018, pageHeight * 0.92]} />
        <meshStandardMaterial color={theme === 'chess' ? '#990000' : '#4a433d'} transparent opacity={0.11} />
      </mesh>

      <group ref={turningPage} position={[hingeX, 0, rightStackDepth / 2 + 0.02]}>
        <mesh position={[pageWidth / 2, 0, 0]} castShadow>
          <planeGeometry args={[pageWidth, pageHeight, 24, 1]} />
          <meshStandardMaterial color={pagePaper} roughness={0.99} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
