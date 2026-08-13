'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SPIRAL, getBookTransformAtAngle } from '../../../lib/spiral'

const PALETTE = [
  '#b8a995',
  '#7f6c5c',
  '#9a725f',
  '#727866',
  '#596c67',
  '#8c7f91',
  '#b38b63',
  '#6f5d56',
  '#9b9177',
]

function buildFillerBooks(bookCount) {
  const books = []
  const fillersPerGap = 3

  for (let gap = 0; gap < Math.max(0, bookCount - 1); gap += 1) {
    for (let slot = 0; slot < fillersPerGap; slot += 1) {
      const fraction = (slot + 1) / (fillersPerGap + 1)
      const seed = gap * fillersPerGap + slot
      const angle = SPIRAL.startAngle + (gap + fraction) * SPIRAL.angleStep
      const height = 1.38 + ((seed * 37) % 48) / 100
      const width = 0.82 + ((seed * 19) % 24) / 100
      const thickness = 0.16 + ((seed * 13) % 13) / 100
      const color = PALETTE[seed % PALETTE.length]
      const lean = ((seed % 5) - 2) * 0.012

      books.push({
        id: `filler-${gap}-${slot}`,
        angle,
        height,
        width,
        thickness,
        color,
        lean,
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

  const pageColor = new THREE.Color(book.color).lerp(new THREE.Color('#eee5d7'), 0.66)
  const coverThickness = 0.032
  const coverOverhang = 0.025

  return (
    <group
      position={transform.position}
      rotation={[0, transform.rotation[1], book.lean]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[book.width, book.height, Math.max(0.05, book.thickness - 0.045)]} />
        <meshStandardMaterial color={pageColor} roughness={0.94} />
      </mesh>

      <mesh position={[0, 0, book.thickness / 2]} castShadow>
        <boxGeometry args={[
          book.width + coverOverhang,
          book.height + coverOverhang,
          coverThickness,
        ]} />
        <meshStandardMaterial color={book.color} roughness={0.76} />
      </mesh>

      <mesh position={[0, 0, -book.thickness / 2]} castShadow>
        <boxGeometry args={[
          book.width + coverOverhang,
          book.height + coverOverhang,
          coverThickness,
        ]} />
        <meshStandardMaterial color={book.color} roughness={0.76} />
      </mesh>

      <mesh position={[-book.width / 2 - 0.018, 0, 0]} castShadow>
        <boxGeometry args={[0.036, book.height + 0.035, book.thickness + 0.045]} />
        <meshStandardMaterial color={book.color} roughness={0.72} />
      </mesh>

      {book.id.endsWith('-1') && (
        <mesh
          position={[-book.width / 2 - 0.038, book.height * 0.18, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[book.thickness * 0.52, 0.018]} />
          <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
        </mesh>
      )}
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
