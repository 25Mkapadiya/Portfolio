export const SPIRAL = {
  radius: 2.85,
  angleStep: 0.58,
  risePerBook: 0.34,
  startAngle: -1.25,
  startShelfY: -2.42,
  shelfWidth: 1.48,
  shelfDepth: 0.78,
  shelfThickness: 0.12,
  bookGap: 0.025,
  averageBookHeight: 1.7,
}

export const LIBRARY_FOCUS = {
  angle: Math.PI / 2,
  y: -0.12,
}

export function getShelfTransform(index, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const angle = config.startAngle + index * config.angleStep
  const y = config.startShelfY + index * config.risePerBook
  const x = Math.cos(angle) * config.radius
  const z = Math.sin(angle) * config.radius

  return {
    angle,
    position: [x, y, z],
    rotation: [0, -angle + Math.PI / 2, 0],
    radial: [Math.cos(angle), 0, Math.sin(angle)],
  }
}

export function getBookTransform(index, bookHeight = SPIRAL.averageBookHeight, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const shelf = getShelfTransform(index, overrides)
  const bookCenterY =
    shelf.position[1] +
    config.shelfThickness / 2 +
    config.bookGap +
    bookHeight / 2

  return {
    ...shelf,
    position: [shelf.position[0], bookCenterY, shelf.position[2]],
    shelfPosition: shelf.position,
  }
}

// Kept as a compatibility alias for any older components still importing it.
export function getSpiralTransform(index, overrides = {}) {
  return getBookTransform(index, SPIRAL.averageBookHeight, overrides)
}

export function getLibraryMotion(progress, bookCount) {
  const count = Math.max(1, bookCount)
  const steps = Math.max(0, count - 1)
  const clamped = Math.min(1, Math.max(0, progress))
  const currentIndex = clamped * steps
  const currentAngle = SPIRAL.startAngle + currentIndex * SPIRAL.angleStep
  const currentShelfY = SPIRAL.startShelfY + currentIndex * SPIRAL.risePerBook
  const averageBookCenterY =
    currentShelfY +
    SPIRAL.shelfThickness / 2 +
    SPIRAL.bookGap +
    SPIRAL.averageBookHeight / 2

  return {
    rotationY: currentAngle - LIBRARY_FOCUS.angle,
    positionY: LIBRARY_FOCUS.y - averageBookCenterY,
  }
}

export function getShelfSegments(count = 12) {
  return Array.from({ length: count }, (_, index) => ({
    id: `shelf-${index}`,
    ...getShelfTransform(index),
  }))
}
