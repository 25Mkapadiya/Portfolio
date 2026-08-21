'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Atmosphere({ reducedMotion }) {
  const points = useRef()
  const positions = useMemo(() => {
    const count = 34
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 11
      array[i * 3 + 1] = (Math.random() - 0.5) * 8
      array[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return array
  }, [])

  useFrame((state) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.y = state.clock.elapsedTime * 0.0035
  })

  return (
    <points ref={points} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cfc6bb"
        size={0.013}
        transparent
        opacity={0.16}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
