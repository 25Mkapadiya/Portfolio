'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const browsePosition = new THREE.Vector3()
const readingPosition = new THREE.Vector3(0, 0.055, 5.15)
const browseLook = new THREE.Vector3()
const readingLook = new THREE.Vector3(0, -0.02, 3.5)
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
    const rawProgress = reducedMotion
      ? (activeProject ? 1 : 0)
      : THREE.MathUtils.clamp(scrollState.current.readerProgress ?? 0, 0, 1)
    const progress = smoothUnit(rawProgress)

    const scrollProgress = scrollState.current.current
    const pointerX = reducedMotion ? 0 : state.pointer.x * 0.055 * (1 - progress)
    const pointerY = reducedMotion ? 0 : state.pointer.y * 0.025 * (1 - progress)
    const counterArc = (scrollProgress - 0.5) * 0.28

    browsePosition.set(
      Math.sin(counterArc) * 0.42 + pointerX,
      0.3 + Math.sin(scrollProgress * Math.PI) * 0.085 + pointerY,
      8.68 + Math.cos(counterArc) * 0.045,
    )
    browseLook.set(0, -0.075, 0.68)

    targetPosition.lerpVectors(browsePosition, readingPosition, progress)
    lookTarget.lerpVectors(browseLook, readingLook, progress)

    const alpha = reducedMotion ? 1 : 1 - Math.exp(-12 * delta)
    camera.position.lerp(targetPosition, alpha)
    camera.getWorldDirection(currentDirection)
    currentLook.copy(camera.position).add(currentDirection)
    currentLook.lerp(lookTarget, alpha)
    camera.lookAt(currentLook)
  })

  return null
}
