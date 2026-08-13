import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function HeroObject() {
  const mesh = useRef()

  useFrame((state, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += delta * 0.18
    mesh.current.rotation.y += delta * 0.28

    const targetX = state.pointer.y * 0.35
    const targetY = state.pointer.x * 0.55
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetX, 0.03)
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetY, 0.03)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} castShadow receiveShadow>
        <torusKnotGeometry args={[1.15, 0.34, 220, 32]} />
        <meshPhysicalMaterial
          color="#d9ff45"
          metalness={0.15}
          roughness={0.18}
          transmission={0.08}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.8]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <pointLight position={[-4, -2, 3]} intensity={2} />
      <HeroObject />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </Canvas>
  )
}

const projects = [
  ['01', 'Project One', 'Interactive experience'],
  ['02', 'Project Two', 'Creative development'],
  ['03', 'Project Three', '3D / motion experiment'],
]

export default function App() {
  return (
    <main>
      <nav className="nav">
        <a href="#top" className="wordmark">MK</a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Personal portfolio / 2026</p>
          <h1>
            I build digital
            <span>experiences.</span>
          </h1>
          <p className="hero-note">
            Design, code, experimentation and 3D. This is the starting point for a portfolio that feels more like an experience than a template.
          </p>
        </div>
        <div className="hero-canvas" aria-label="Interactive 3D object">
          <Scene />
        </div>
        <a href="#work" className="scroll-cue">Scroll to explore ↓</a>
      </section>

      <section className="work section" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Things I&apos;ve made.</h2>
        </div>
        <div className="project-list">
          {projects.map(([number, title, type]) => (
            <a href="#contact" className="project-row" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <em>{type}</em>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="about section" id="about">
        <p className="eyebrow">About</p>
        <div className="about-grid">
          <h2>Curious by default.</h2>
          <p>
            I like turning ideas into things people can see, use and interact with. This website will become a collection of projects, experiments and the process behind them.
          </p>
        </div>
      </section>

      <section className="contact section" id="contact">
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s make something interesting.</h2>
        <a href="mailto:hello@example.com" className="contact-link">hello@example.com ↗</a>
      </section>
    </main>
  )
}
