'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const targetPosition = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

export default function CameraRig({ activeProject, reducedMotion }) {
  const { camera } = useThree()
  const scroll = useRef(0)
  const scrollTarget = useRef(0)

  useEffect(() => {
    const onWheel = (event) => {
      if (activeProject || reducedMotion) return
      scrollTarget.current = THREE.MathUtils.clamp(
        scrollTarget.current + event.deltaY * 0.0016,
        -1.35,
        1.55,
      )
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeProject, reducedMotion])

  useFrame((state, delta) => {
    const alpha = 1 - Math.exp(-5 * delta)
    scroll.current = THREE.MathUtils.lerp(scroll.current, scrollTarget.current, alpha)

    if (activeProject) {
      targetPosition.set(0, 0.18, 8.25)
      lookTarget.set(0, 0.08, 3.5)
    } else {
      const orbit = scroll.current * 0.22
      const pointerX = reducedMotion ? 0 : state.pointer.x * 0.18
      const pointerY = reducedMotion ? 0 : state.pointer.y * 0.08
      targetPosition.set(
        Math.sin(orbit) * 1.25 + pointerX,
        0.45 + scroll.current * 0.8 + pointerY,
        8.45 - Math.abs(scroll.current) * 0.15,
      )
      lookTarget.set(0, scroll.current * 0.48, 0)
    }

    camera.position.lerp(targetPosition, alpha)
    const currentDirection = new THREE.Vector3()
    camera.getWorldDirection(currentDirection)
    const currentLook = camera.position.clone().add(currentDirection)
    currentLook.lerp(lookTarget, alpha)
    camera.lookAt(currentLook)
  })

  return null
}
