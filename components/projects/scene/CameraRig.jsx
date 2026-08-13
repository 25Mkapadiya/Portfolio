'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const targetPosition = new THREE.Vector3()
const lookTarget = new THREE.Vector3()
const currentDirection = new THREE.Vector3()
const currentLook = new THREE.Vector3()

export default function CameraRig({ activeProject, reducedMotion, scrollState }) {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const alpha = 1 - Math.exp(-5.2 * delta)

    if (activeProject) {
      // Reading mode should feel intimate: close enough that the spread fills
      // most of the viewport, but with enough vertical room for the tallest book.
      targetPosition.set(0, 0.11, 7.82)
      lookTarget.set(0, -0.03, 3.34)
    } else {
      const progress = scrollState.current.current
      const pointerX = reducedMotion ? 0 : state.pointer.x * 0.16
      const pointerY = reducedMotion ? 0 : state.pointer.y * 0.075

      const counterArc = (progress - 0.5) * 0.34
      targetPosition.set(
        Math.sin(counterArc) * 0.48 + pointerX,
        0.31 + Math.sin(progress * Math.PI) * 0.11 + pointerY,
        8.62 + Math.cos(counterArc) * 0.06,
      )
      lookTarget.set(0, -0.08, 0.65)
    }

    camera.position.lerp(targetPosition, alpha)
    camera.getWorldDirection(currentDirection)
    currentLook.copy(camera.position).add(currentDirection)
    currentLook.lerp(lookTarget, alpha)
    camera.lookAt(currentLook)
  })

  return null
}
