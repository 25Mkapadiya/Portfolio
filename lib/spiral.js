export const SPIRAL = {
  radius: 2.75,
  angleStep: 0.52,
  risePerBook: 0.31,
  startAngle: -1.25,
  startY: -1.75,
}

export const LIBRARY_FOCUS = {
  angle: Math.PI / 2,
  y: -0.12,
}

export function getSpiralTransform(index, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const angle = config.startAngle + index * config.angleStep
  const y = config.startY + index * config.risePerBook
  const x = Math.cos(angle) * config.radius
  const z = Math.sin(angle) * config.radius

  return {
    angle,
    position: [x, y, z],
    rotation: [0, -angle + Math.PI / 2, 0],
    radial: [Math.cos(angle), 0, Math.sin(angle)],
  }
}

export function getLibraryMotion(progress, bookCount) {
  const count = Math.max(1, bookCount)
  const steps = Math.max(0, count - 1)
  const clamped = Math.min(1, Math.max(0, progress))
  const currentAngle = SPIRAL.startAngle + clamped * steps * SPIRAL.angleStep
  const currentY = SPIRAL.startY + clamped * steps * SPIRAL.risePerBook

  // Rotating the parent by currentAngle - focusAngle puts the current book at
  // the camera-facing point of the helix while preserving its radial orientation.
  return {
    rotationY: currentAngle - LIBRARY_FOCUS.angle,
    positionY: LIBRARY_FOCUS.y - currentY,
  }
}

export function getShelfSegments(count = 26) {
  return Array.from({ length: count }, (_, index) => {
    const angle = SPIRAL.startAngle - 0.25 + index * (SPIRAL.angleStep * 0.5)
    const y = SPIRAL.startY - 0.92 + index * (SPIRAL.risePerBook * 0.5)
    const x = Math.cos(angle) * SPIRAL.radius
    const z = Math.sin(angle) * SPIRAL.radius
    return {
      id: `shelf-${index}`,
      position: [x, y, z],
      rotation: [0, -angle + Math.PI / 2, 0],
    }
  })
}
