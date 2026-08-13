'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpiralScrollController({ scrollState, activeProject, reducedMotion, onFocus }) {
  const wheel = useRef({ locked: false, timer: null, sum: 0 })

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

      if (wheel.current.timer) window.clearTimeout(wheel.current.timer)
      wheel.current.timer = window.setTimeout(() => {
        wheel.current.locked = false
        wheel.current.sum = 0
      }, 320)

      if (wheel.current.locked) return

      wheel.current.sum += event.deltaY
      if (Math.abs(wheel.current.sum) < 24) return

      wheel.current.locked = true
      move(wheel.current.sum > 0 ? 1 : -1)
      wheel.current.sum = 0
    }

    motion.target = max ? motion.focusIndex / max : 0
    onFocus?.(motion.focusIndex)

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      if (wheel.current.timer) window.clearTimeout(wheel.current.timer)
      window.removeEventListener('wheel', onWheel)
    }
  }, [activeProject, onFocus, scrollState])

  useFrame((_, delta) => {
    const motion = scrollState.current
    motion.current = reducedMotion ? motion.target : THREE.MathUtils.damp(motion.current, motion.target, 7.4, delta)
    if (Math.abs(motion.current - motion.target) < 0.0004) motion.current = motion.target
  })

  return null
}
