export const SPIRAL = {
  angleStep: 0.6,
  risePerBook: 0.32,
  startAngle: -1.25,
  startShelfY: -2.38,

  // Continuous bookcase dimensions.
  innerRadius: 2.48,
  shelfDepth: 1.08,
  shelfThickness: 0.16,
  backThickness: 0.12,
  backHeight: 2.02,
  structurePaddingAngle: 0.34,

  // Book placement.
  bookGap: 0.022,
  bookBackGap: 0.055,
  averageBookHeight: 1.7,
  averageBookThickness: 0.27,
}

export const LIBRARY_FOCUS = {
  angle: Math.PI / 2,
  y: -0.12,
}

export function getShelfYAtAngle(angle, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const indexPosition = (angle - config.startAngle) / config.angleStep
  return config.startShelfY + indexPosition * config.risePerBook
}

export function getShelfTransform(index, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const angle = config.startAngle + index * config.angleStep
  const y = config.startShelfY + index * config.risePerBook
  const radius = config.innerRadius + config.shelfDepth * 0.5
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  return {
    angle,
    position: [x, y, z],
    rotation: [0, -angle + Math.PI / 2, 0],
    radial: [Math.cos(angle), 0, Math.sin(angle)],
  }
}

export function getBookTransform(index, book = {}, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const height = book.height ?? config.averageBookHeight
  const thickness = book.thickness ?? config.averageBookThickness
  const angle = config.startAngle + index * config.angleStep
  const shelfY = config.startShelfY + index * config.risePerBook

  // Books sit against the continuous inner back wall rather than floating at
  // the middle of the shelf. Local +Z faces outward, so thickness grows away
  // from the wall toward the viewer.
  const radius =
    config.innerRadius +
    config.backThickness +
    config.bookBackGap +
    thickness * 0.5

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y =
    shelfY +
    config.shelfThickness * 0.5 +
    config.bookGap +
    height * 0.5

  return {
    angle,
    position: [x, y, z],
    shelfY,
    rotation: [0, -angle + Math.PI / 2, 0],
    radial: [Math.cos(angle), 0, Math.sin(angle)],
  }
}

export function getSpiralTransform(index, overrides = {}) {
  return getBookTransform(index, {}, overrides)
}

export function getStructureRange(bookCount, overrides = {}) {
  const config = { ...SPIRAL, ...overrides }
  const count = Math.max(1, bookCount)
  return {
    startAngle: config.startAngle - config.structurePaddingAngle,
    endAngle:
      config.startAngle +
      (count - 1) * config.angleStep +
      config.structurePaddingAngle,
  }
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
    SPIRAL.shelfThickness * 0.5 +
    SPIRAL.bookGap +
    SPIRAL.averageBookHeight * 0.5

  return {
    rotationY: currentAngle - LIBRARY_FOCUS.angle,
    positionY: LIBRARY_FOCUS.y - averageBookCenterY,
  }
}
