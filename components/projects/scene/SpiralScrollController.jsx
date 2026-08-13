'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WHEEL_THRESHOLD = 28
const STEP_COOLDOWN = 430
const TOUCH_THRESHOLD = 42

export default function SpiralScrollController({
  scrollState,
  activeProject,
  reducedMotion,
  onFocus,
}) {
  const gesture = useRef({
    wheel: 0,
    lastStep: 0,
    touchStartY: null,
  })

  useEffect(() => {
    const motion = scrollState.current
    const count = Math.max(1, motion.bookCount ?? 1)
    const maxIndex = Math.max(0, count - 1)

    if (!Number.isFinite(motion.focusIndex)) {
      motion.focusIndex = Math.round((motion.current ?? 0) * maxIndex)
    }

    const snapToIndex = (nextIndex) => {
      if (activeProject) return

      const index = THREE.MathUtils.clamp(nextIndex, 0, maxIndex)
      if (index === motion.focusIndex) return

      motion.focusIndex = index
      motion.target = maxIndex > 0 ? index / maxIndex : 0
      motion.lastInput = performance.now()
      onFocus?.(index)
    }

    const step = (direction) => {
      const now = performance.now()
      if (now - gesture.current.lastStep < STEP_COOLDOWN) return

      const currentIndex = Number.isFinite(motion.focusIndex) ? motion.focusIndex : 0
      const nextIndex = THREE.MathUtils.clamp(currentIndex + direction, 0, maxIndex)
      if (nextIndex === currentIndex) return

      gesture.current.lastStep = now
      gesture.current.wheel = 0
      snapToIndex(nextIndex)
    }

    const onWheel = (event) => {
      if (activeProject) return
      event.preventDefault()

      gesture.current.wheel += event.deltaY
      if (Math.abs(gesture.current.wheel) < WHEEL_THRESHOLD) return

      step(gesture.current.wheel > 0 ? 1 : -1)
    }

    const onKeyDown = (event) => {
      if (activeProject) return
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        step(1)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        step(-1)
      }
    }

    const onTouchStart = (event) => {
      if (activeProject) return
      gesture.current.touchStartY = event.touches?.[0]?.clientY ?? null
    }

    const onTouchEnd = (event) => {
      if (activeProject || gesture.current.touchStartY == null) return
      const endY = event.changedTouches?.[0]?.clientY
      if (!Number.isFinite(endY)) return

      const delta = gesture.current.touchStartY - endY
      gesture.current.touchStartY = null
      if (Math.abs(delta) < TOUCH_THRESHOLD) return
      step(delta > 0 ? 1 : -1)
    }

    // Always begin exactly centered on a book rather than between two stops.
    motion.target = maxIndex > 0 ? motion.focusIndex / maxIndex : 0
    onFocus?.(motion.focusIndex)

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeProject, onFocus, scrollState])

  useFrame((_, delta) => {
    const motion = scrollState.current

    if (reducedMotion) {
      motion.current = motion.target
      return
    }

    // The target is always an exact book index. This easing only animates the
    // travel between stops; it never allows the library to rest between books.
    motion.current = THREE.MathUtils.damp(motion.current, motion.target, 6.8, delta)
    if (Math.abs(motion.current - motion.target) < 0.0004) {
      motion.current = motion.target
    }
  })

  return null
}
