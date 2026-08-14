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

    pushQuad(vertices, it0, ot0, ot1, it1)
    pushQuad(vertices, ib1, ob1, ob0, ib0)
    pushQuad(vertices, ot0, ob0, ob1, ot1)
    pushQuad(vertices, ib1, ib0, it0, it1)

    if (i === 0) pushQuad(vertices, ib0, ob0, ot0, it0)
    if (i === segments - 1) pushQuad(vertices, it1, ot1, ob1, ib1)
  }

  return makeGeometry(vertices)
}

function buildShelfEdgeGeometry(bookCount) {
  const vertices = []
  const { startAngle, endAngle } = getStructureRange(bookCount)
  const segments = Math.max(120, Math.ceil((endAngle - startAngle) * 34))
  const radius = SPIRAL.innerRadius + SPIRAL.shelfDepth + 0.007
  const bandHeight = Math.min(0.055, SPIRAL.shelfThickness * 0.34)

  for (let i = 0; i < segments; i += 1) {
    const t0 = i / segments
    const t1 = (i + 1) / segments
    const a0 = THREE.MathUtils.lerp(startAngle, endAngle, t0)
    const a1 = THREE.MathUtils.lerp(startAngle, endAngle, t1)
    const y0 = getShelfYAtAngle(a0)
    const y1 = getShelfYAtAngle(a1)
    const top0 = point(radius, a0, y0 + bandHeight * 0.5)
    const top1 = point(radius, a1, y1 + bandHeight * 0.5)
    const bottom0 = point(radius, a0, y0 - bandHeight * 0.5)
    const bottom1 = point(radius, a1, y1 - bandHeight * 0.5)

    pushQuad(vertices, top0, bottom0, bottom1, top1)
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
  const shelfEdgeGeometry = useMemo(() => buildShelfEdgeGeometry(bookCount), [bookCount])
  const backGeometry = useMemo(() => buildBackGeometry(bookCount), [bookCount])

  return (
    <group raycast={() => null}>
      <mesh geometry={shelfGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#cbbda7"
          roughness={0.58}
          metalness={0}
          clearcoat={0.13}
          clearcoatRoughness={0.76}
          sheen={0.16}
          sheenRoughness={0.9}
          sheenColor="#f7ead5"
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={shelfEdgeGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#8f765d"
          roughness={0.7}
          metalness={0.01}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={backGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#b9aa95"
          roughness={0.7}
          metalness={0}
          clearcoat={0.06}
          clearcoatRoughness={0.88}
          sheen={0.08}
          sheenRoughness={0.94}
          sheenColor="#efe1cc"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
