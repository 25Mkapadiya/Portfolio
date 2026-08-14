'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SPIRAL, getBookTransformAtAngle } from '../../../lib/spiral'

const PALETTE = [
  '#8d806f',
  '#667065',
  '#765f55',
  '#68737a',
  '#9a8066',
  '#73666d',
  '#8d876f',
  '#5e6a66',
  '#a18468',
]

const PAPER = new THREE.Color('#eee8de')

function buildFillerBooks(bookCount) {
  const books = []
  const fillersPerGap = 3

  for (let gap = 0; gap < Math.max(0, bookCount - 1); gap += 1) {
    for (let slot = 0; slot < fillersPerGap; slot += 1) {
      const fraction = (slot + 1) / (fillersPerGap + 1)
      const seed = gap * fillersPerGap + slot
      const angle = SPIRAL.startAngle + (gap + fraction) * SPIRAL.angleStep
      const height = 1.4 + ((seed * 37) % 43) / 100
      const width = 0.84 + ((seed * 19) % 20) / 100
      const thickness = 0.16 + ((seed * 13) % 12) / 100
      const color = PALETTE[seed % PALETTE.length]
      const lean = ((seed % 5) - 2) * 0.009

      books.push({
        id: `filler-${gap}-${slot}`,
        angle,
        height,
        width,
        thickness,
        color,
        lean,
        cloth: seed % 3 !== 1,
        banded: seed % 4 === 1,
      })
    }
  }

  return books
}

function FillerBook({ book }) {
  const transform = useMemo(
    () => getBookTransformAtAngle(book.angle, book),
    [book],
  )

  const pageColor = useMemo(
    () => new THREE.Color(book.color).lerp(PAPER, 0.72),
    [book.color],
  )
  const coverThickness = 0.032
  const coverOverhang = 0.025
  const coverRoughness = book.cloth ? 0.88 : 0.72
  const shelfContactY = -book.height / 2 - SPIRAL.bookGap + 0.006

  return (
    <group position={transform.position} rotation={[0, transform.rotation[1], 0]} raycast={() => null}>
      <mesh position={[0, shelfContactY, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[book.width * 0.88, Math.max(0.14, book.thickness * 1.38)]} />
        <meshBasicMaterial
          color="#3b332c"
          transparent
          opacity={0.065}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>

      <group rotation={[0, 0, book.lean]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[book.width, book.height, Math.max(0.05, book.thickness - 0.045)]} />
          <meshStandardMaterial color={pageColor} roughness={0.97} />
        </mesh>

        <mesh position={[0, 0, book.thickness / 2]} castShadow>
          <boxGeometry args={[
            book.width + coverOverhang,
            book.height + coverOverhang,
            coverThickness,
          ]} />
          <meshPhysicalMaterial
            color={book.color}
            roughness={coverRoughness}
            metalness={0}
            sheen={book.cloth ? 0.14 : 0.04}
            sheenRoughness={0.94}
            sheenColor="#e7ddd0"
          />
        </mesh>

        <mesh position={[0, 0, -book.thickness / 2]} castShadow>
          <boxGeometry args={[
            book.width + coverOverhang,
            book.height + coverOverhang,
            coverThickness,
          ]} />
          <meshPhysicalMaterial
            color={book.color}
            roughness={coverRoughness}
            metalness={0}
            sheen={book.cloth ? 0.14 : 0.04}
            sheenRoughness={0.94}
            sheenColor="#e7ddd0"
          />
        </mesh>

        <mesh position={[-book.width / 2 - 0.018, 0, 0]} castShadow>
          <boxGeometry args={[0.036, book.height + 0.035, book.thickness + 0.045]} />
          <meshPhysicalMaterial
            color={book.color}
            roughness={coverRoughness}
            metalness={0}
            sheen={book.cloth ? 0.12 : 0.03}
            sheenRoughness={0.94}
            sheenColor="#e7ddd0"
          />
        </mesh>

        {book.banded && (
          <>
            <mesh position={[-book.width / 2 - 0.038, book.height * 0.2, 0]}>
              <boxGeometry args={[0.01, 0.018, Math.max(0.07, book.thickness * 0.58)]} />
              <meshStandardMaterial color="#ddd2c2" roughness={0.84} />
            </mesh>
            <mesh position={[-book.width / 2 - 0.038, -book.height * 0.22, 0]}>
              <boxGeometry args={[0.01, 0.012, Math.max(0.06, book.thickness * 0.44)]} />
              <meshStandardMaterial color="#cfc1ae" roughness={0.86} />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}

export default function DecorativeBooks({ bookCount }) {
  const books = useMemo(() => buildFillerBooks(bookCount), [bookCount])

  return (
    <group>
      {books.map((book) => (
        <FillerBook key={book.id} book={book} />
      ))}
    </group>
  )
}
