'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const browsePosition = new THREE.Vector3()
const readingPosition = new THREE.Vector3(0, 0.08, 7.18)
const browseLook = new THREE.Vector3()
const readingLook = new THREE.Vector3(0, -0.03, 3.58)
const targetPosition = new THREE.Vector3()
const lookTarget = new THREE.Vector3()
const currentDirection = new THREE.Vector3()
const currentLook = new THREE.Vector3()

function smoothUnit(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export default function CameraRig({ activeProject, reducedMotion, scrollState }) {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const progress = reducedMotion
      ? (activeProject ? 1 : 0)
      : smoothUnit(scrollState.current.readerProgress ?? 0)

    const scrollProgress = scrollState.current.current
    const pointerX = reducedMotion ? 0 : state.pointer.x * 0.16 * (1 - progress)
    const pointerY = reducedMotion ? 0 : state.pointer.y * 0.075 * (1 - progress)
    const counterArc = (scrollProgress - 0.5) * 0.34

    browsePosition.set(
      Math.sin(counterArc) * 0.48 + pointerX,
      0.31 + Math.sin(scrollProgress * Math.PI) * 0.11 + pointerY,
      8.62 + Math.cos(counterArc) * 0.06,
    )
    browseLook.set(0, -0.08, 0.65)

    targetPosition.lerpVectors(browsePosition, readingPosition, progress)
    lookTarget.lerpVectors(browseLook, readingLook, progress)

    // A small final damp absorbs frame-rate variation without introducing a
    // second animation timeline; the target itself is driven by readerProgress.
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-11 * delta)
    camera.position.lerp(targetPosition, alpha)
    camera.getWorldDirection(currentDirection)
    currentLook.copy(camera.position).add(currentDirection)
    currentLook.lerp(lookTarget, alpha)
    camera.lookAt(currentLook)
  })

  return null
}
