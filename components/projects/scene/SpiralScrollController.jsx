'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function normalizeWheel(event) {
  let delta = event.deltaY
  if (event.deltaMode === 1) delta *= 16
  if (event.deltaMode === 2) delta *= window.innerHeight
  return THREE.MathUtils.clamp(delta, -140, 140)
}

export default function SpiralScrollController({ scrollState, activeProject, reducedMotion }) {
  const touchY = useRef(null)

  useEffect(() => {
    const onWheel = (event) => {
      if (activeProject || reducedMotion) return

      const motion = scrollState.current
      const normalized = normalizeWheel(event) / 140
      motion.target = THREE.MathUtils.clamp(motion.target + normalized * 0.105, 0, 1)
      motion.lastInput = performance.now()
    }

    const onTouchStart = (event) => {
      if (activeProject || reducedMotion || event.touches.length !== 1) return
      touchY.current = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
      if (activeProject || reducedMotion || touchY.current == null || event.touches.length !== 1) return
      const nextY = event.touches[0].clientY
      const delta = touchY.current - nextY
      touchY.current = nextY

      const motion = scrollState.current
      motion.target = THREE.MathUtils.clamp(motion.target + delta * 0.0024, 0, 1)
      motion.lastInput = performance.now()
    }

    const onTouchEnd = () => {
      touchY.current = null
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeProject, reducedMotion, scrollState])

  useFrame((_, delta) => {
    const motion = scrollState.current

    if (reducedMotion) {
      motion.current = motion.target
      return
    }

    motion.current = THREE.MathUtils.damp(motion.current, motion.target, 4.8, delta)

    // A very light magnetic settle keeps a book near the visual focus without
    // making the scroll feel like discrete slides.
    if (!activeProject && performance.now() - motion.lastInput > 260) {
      const steps = Math.max(1, motion.bookCount - 1)
      const nearest = Math.round(motion.target * steps) / steps
      if (Math.abs(nearest - motion.target) < 0.024) {
        motion.target = THREE.MathUtils.damp(motion.target, nearest, 3.2, delta)
      }
    }
  })

  return null
}
