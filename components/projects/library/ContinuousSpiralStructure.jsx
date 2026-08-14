'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SPIRAL, getShelfYAtAngle, getStructureRange } from '../../../lib/spiral'

function pushQuad(vertices, a, b, c, d) {
  vertices.push(
    ...a, ...b, ...c,
    ...a, ...c, ...d,
  )
}

function point(radius, angle, y) {
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
}

function makeGeometry(vertices) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function getSegments(startAngle, endAngle) {
  return Math.max(128, Math.ceil((endAngle - startAngle) * 38))
}

function buildShelfTopGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.shelfDepth
  const halfThickness = SPIRAL.shelfThickness * 0.5

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const y0 = getShelfYAtAngle(a0) + halfThickness
    const y1 = getShelfYAtAngle(a1) + halfThickness

    pushQuad(
      vertices,
      point(inner, a0, y0),
      point(outer, a0, y0),
      point(outer, a1, y1),
      point(inner, a1, y1),
    )
  }

  return makeGeometry(vertices)
}

function buildShelfBodyGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.shelfDepth
  const halfThickness = SPIRAL.shelfThickness * 0.5

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const y0 = getShelfYAtAngle(a0)
    const y1 = getShelfYAtAngle(a1)

    const it0 = point(inner, a0, y0 + halfThickness)
    const it1 = point(inner, a1, y1 + halfThickness)
    const ib0 = point(inner, a0, y0 - halfThickness)
    const ib1 = point(inner, a1, y1 - halfThickness)
    const ob0 = point(outer, a0, y0 - halfThickness)
    const ob1 = point(outer, a1, y1 - halfThickness)

    // Underside and inner return. The outer face is a separate fascia material.
    pushQuad(vertices, ib1, ob1, ob0, ib0)
    pushQuad(vertices, ib1, ib0, it0, it1)

    if (i === 0) {
      const ot0 = point(outer, a0, y0 + halfThickness)
      pushQuad(vertices, ib0, ob0, ot0, it0)
    }
    if (i === segments - 1) {
      const ot1 = point(outer, a1, y1 + halfThickness)
      pushQuad(vertices, it1, ot1, ob1, ib1)
    }
  }

  return makeGeometry(vertices)
}

function buildFrontFasciaGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const radius = SPIRAL.innerRadius + SPIRAL.shelfDepth
  const halfThickness = SPIRAL.shelfThickness * 0.5

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const y0 = getShelfYAtAngle(a0)
    const y1 = getShelfYAtAngle(a1)

    pushQuad(
      vertices,
      point(radius, a0, y0 + halfThickness),
      point(radius, a0, y0 - halfThickness),
      point(radius, a1, y1 - halfThickness),
      point(radius, a1, y1 + halfThickness),
    )
  }

  return makeGeometry(vertices)
}

function buildFrontRevealGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const radius = SPIRAL.innerRadius + SPIRAL.shelfDepth + 0.006
  const halfThickness = SPIRAL.shelfThickness * 0.5
  const bandHeight = 0.026

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const y0 = getShelfYAtAngle(a0) + halfThickness - bandHeight * 0.62
    const y1 = getShelfYAtAngle(a1) + halfThickness - bandHeight * 0.62

    pushQuad(
      vertices,
      point(radius, a0, y0 + bandHeight * 0.5),
      point(radius, a0, y0 - bandHeight * 0.5),
      point(radius, a1, y1 - bandHeight * 0.5),
      point(radius, a1, y1 + bandHeight * 0.5),
    )
  }

  return makeGeometry(vertices)
}

function buildBackFaceGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.backThickness

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const shelf0 = getShelfYAtAngle(a0) + SPIRAL.shelfThickness * 0.5
    const shelf1 = getShelfYAtAngle(a1) + SPIRAL.shelfThickness * 0.5
    const top0 = shelf0 + SPIRAL.backHeight
    const top1 = shelf1 + SPIRAL.backHeight

    const i0b = point(inner, a0, shelf0)
    const i1b = point(inner, a1, shelf1)
    const i0t = point(inner, a0, top0)
    const i1t = point(inner, a1, top1)
    const o0b = point(outer, a0, shelf0)
    const o1b = point(outer, a1, shelf1)
    const o0t = point(outer, a0, top0)
    const o1t = point(outer, a1, top1)

    pushQuad(vertices, o0b, o1b, o1t, o0t)
    pushQuad(vertices, i1b, i0b, i0t, i1t)

    if (i === 0) pushQuad(vertices, i0b, o0b, o0t, i0t)
    if (i === segments - 1) pushQuad(vertices, o1b, i1b, i1t, o1t)
  }

  return makeGeometry(vertices)
}

function buildBackCapGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = getSegments(startAngle, endAngle)
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.backThickness

  for (let i = 0; i < segments; i += 1) {
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, i / segments)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, (i + 1) / segments)
    const top0 = getShelfYAtAngle(a0) + SPIRAL.shelfThickness * 0.5 + SPIRAL.backHeight
    const top1 = getShelfYAtAngle(a1) + SPIRAL.shelfThickness * 0.5 + SPIRAL.backHeight

    pushQuad(
      vertices,
      point(outer, a0, top0),
      point(outer, a1, top1),
      point(inner, a1, top1),
      point(inner, a0, top0),
    )
  }

  return makeGeometry(vertices)
}

export default function ContinuousSpiralStructure({ bookCount }) {
  const shelfTopGeometry = useMemo(() => buildShelfTopGeometry(bookCount), [bookCount])
  const shelfBodyGeometry = useMemo(() => buildShelfBodyGeometry(bookCount), [bookCount])
  const frontFasciaGeometry = useMemo(() => buildFrontFasciaGeometry(bookCount), [bookCount])
  const frontRevealGeometry = useMemo(() => buildFrontRevealGeometry(bookCount), [bookCount])
  const backFaceGeometry = useMemo(() => buildBackFaceGeometry(bookCount), [bookCount])
  const backCapGeometry = useMemo(() => buildBackCapGeometry(bookCount), [bookCount])

  return (
    <group raycast={() => null}>
      <mesh geometry={shelfTopGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#ddd6cc"
          roughness={0.72}
          metalness={0}
          clearcoat={0.035}
          clearcoatRoughness={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={shelfBodyGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#cfc4b6"
          roughness={0.82}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={frontFasciaGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#c1b29f"
          roughness={0.7}
          metalness={0}
          clearcoat={0.025}
          clearcoatRoughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={frontRevealGeometry} receiveShadow>
        <meshStandardMaterial
          color="#a99882"
          roughness={0.76}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={backFaceGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#c8beb2"
          roughness={0.88}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={backCapGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#d6cec3"
          roughness={0.76}
          metalness={0}
          clearcoat={0.025}
          clearcoatRoughness={0.94}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
