'use client'

import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpiralScrollController({ scrollState, activeProject, reducedMotion }) {
  useEffect(() => {
    const shell = document.querySelector('.projects-shell')
    if (!shell) return undefined

    const updateFromNativeScroll = () => {
      if (activeProject) return

      const rect = shell.getBoundingClientRect()
      const travel = Math.max(1, shell.offsetHeight - window.innerHeight)
      const progress = THREE.MathUtils.clamp(-rect.top / travel, 0, 1)
      const motion = scrollState.current
      motion.target = progress
      motion.lastInput = performance.now()
    }

    updateFromNativeScroll()
    window.addEventListener('scroll', updateFromNativeScroll, { passive: true })
    window.addEventListener('resize', updateFromNativeScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateFromNativeScroll)
      window.removeEventListener('resize', updateFromNativeScroll)
    }
  }, [activeProject, scrollState])

  useFrame((_, delta) => {
    const motion = scrollState.current

    if (reducedMotion) {
      motion.current = motion.target
      return
    }

    // Native scrolling supplies the inertia. This small amount of damping removes
    // visual jitter without making the bookshelf lag behind the user's gesture.
    motion.current = THREE.MathUtils.damp(motion.current, motion.target, 7.2, delta)
  })

  return null
}
