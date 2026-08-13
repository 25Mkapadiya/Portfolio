'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpiralScrollController({ scrollState, activeProject, reducedMotion, onFocus }) {
  const wheel = useRef({ locked: false, sum: 0, lastAt: 0, lastDelta: 0, decaying: false })

  useEffect(() => {
    const motion = scrollState.current
    const max = Math.max(0, (motion.bookCount ?? 1) - 1)

    const move = (dir) => {
      const current = Number.isFinite(motion.focusIndex) ? motion.focusIndex : 0
      const next = THREE.MathUtils.clamp(current + dir, 0, max)
      if (next === current) return
      motion.focusIndex = next
      motion.target = max ? next / max : 0
      onFocus?.(next)
    }

    const onWheel = (event) => {
      if (activeProject) return
      event.preventDefault()

      const now = performance.now()
      const delta = event.deltaY
      const abs = Math.abs(delta)
      const prevAbs = Math.abs(wheel.current.lastDelta)
      const sameDirection = Math.sign(delta) === Math.sign(wheel.current.lastDelta)
      const freshImpulse =
        !wheel.current.lastAt ||
        !sameDirection ||
        now - wheel.current.lastAt > 70 ||
        (wheel.current.decaying && abs > 8 && abs > prevAbs * 1.5)

      if (freshImpulse) {
        wheel.current.locked = false
        wheel.current.sum = 0
        wheel.current.decaying = false
      }

      if (!wheel.current.locked) {
        wheel.current.sum += delta
        if (Math.abs(wheel.current.sum) >= 22) {
          wheel.current.locked = true
          move(wheel.current.sum > 0 ? 1 : -1)
        }
      }

      if (prevAbs > 0 && abs < prevAbs * 0.9) wheel.current.decaying = true
      wheel.current.lastDelta = delta
      wheel.current.lastAt = now
    }

    motion.target = max ? motion.focusIndex / max : 0
    onFocus?.(motion.focusIndex)
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeProject, onFocus, scrollState])

  useFrame((_, delta) => {
    const motion = scrollState.current
    motion.current = reducedMotion ? motion.target : THREE.MathUtils.damp(motion.current, motion.target, 8.6, delta)
    if (Math.abs(motion.current - motion.target) < 0.0004) motion.current = motion.target
  })

  return null
}
