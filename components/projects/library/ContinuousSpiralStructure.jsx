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
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  )
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function buildShelfGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = Math.max(120, Math.ceil((endAngle - startAngle) * 34))
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.shelfDepth
  const halfThickness = SPIRAL.shelfThickness * 0.5

  for (let i = 0; i < segments; i += 1) {
    const t0 = i / segments
    const t1 = (i + 1) / segments
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, t0)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, t1)
    const y0 = getShelfYAtAngle(a0)
    const y1 = getShelfYAtAngle(a1)

    const it0 = point(inner, a0, y0 + halfThickness)
    const ot0 = point(outer, a0, y0 + halfThickness)
    const it1 = point(inner, a1, y1 + halfThickness)
    const ot1 = point(outer, a1, y1 + halfThickness)

    const ib0 = point(inner, a0, y0 - halfThickness)
    const ob0 = point(outer, a0, y0 - halfThickness)
    const ib1 = point(inner, a1, y1 - halfThickness)
    const ob1 = point(outer, a1, y1 - halfThickness)

    // Top and underside of the continuous spiral ribbon.
    pushQuad(vertices, it0, ot0, ot1, it1)
    pushQuad(vertices, ib1, ob1, ob0, ib0)

    // Continuous outer and inner fascias make the ribbon read as furniture,
    // rather than a collection of disconnected steps.
    pushQuad(vertices, ot0, ob0, ob1, ot1)
    pushQuad(vertices, ib1, ib0, it0, it1)

    if (i === 0) pushQuad(vertices, ib0, ob0, ot0, it0)
    if (i === segments - 1) pushQuad(vertices, it1, ot1, ob1, ib1)
  }

  return makeGeometry(vertices)
}

function buildBackGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = Math.max(120, Math.ceil((endAngle - startAngle) * 34))
  const inner = SPIRAL.innerRadius
  const outer = SPIRAL.innerRadius + SPIRAL.backThickness

  for (let i = 0; i < segments; i += 1) {
    const t0 = i / segments
    const t1 = (i + 1) / segments
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, t0)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, t1)
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

    // The outward-facing wall is the visual back of the bookcase.
    pushQuad(vertices, o0b, o1b, o1t, o0t)
    pushQuad(vertices, i1b, i0b, i0t, i1t)
    pushQuad(vertices, o0t, o1t, i1t, i0t)

    if (i === 0) pushQuad(vertices, i0b, o0b, o0t, i0t)
    if (i === segments - 1) pushQuad(vertices, o1b, i1b, i1t, o1t)
  }

  return makeGeometry(vertices)
}

export default function ContinuousSpiralStructure({ bookCount }) {
  const shelfGeometry = useMemo(() => buildShelfGeometry(bookCount), [bookCount])
  const backGeometry = useMemo(() => buildBackGeometry(bookCount), [bookCount])

  return (
    <group>
      <mesh geometry={shelfGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e7dfd3"
          roughness={0.78}
          metalness={0.015}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={backGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#d9d0c3"
          roughness={0.84}
          metalness={0.01}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
