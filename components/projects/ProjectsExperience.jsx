'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { findProject, interactiveProjects } from '../../data/projects'
import ProjectsScene from './scene/ProjectsScene'
import ProjectOverlay from './ui/ProjectOverlay'
import ProjectLoader from './ui/ProjectLoader'
import useReducedMotion from './useReducedMotion'

function slugFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  return parts[0] === 'projects' ? parts[1] ?? null : null
}

export default function ProjectsExperience({ initialSlug }) {
  const reducedMotion = useReducedMotion()
  const [loading, setLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [activeProject, setActiveProject] = useState(() => (initialSlug ? findProject(initialSlug) : null))
  const [pageIndex, setPageIndex] = useState(0)
  const [pageDirection, setPageDirection] = useState(1)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })

  const currentPageCount = activeProject?.pages?.length ?? 0

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 120 : 850)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    const move = (event) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    if (!activeProject) return undefined

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [activeProject])

  const openProject = useCallback((project, { updateHistory = true } = {}) => {
    if (!project?.interactive) return
    setHoveredProject(null)
    setPageIndex(0)
    setPageDirection(1)
    setActiveProject(project)
    if (updateHistory && window.location.pathname !== `/projects/${project.slug}`) {
      window.history.pushState({ project: project.slug }, '', `/projects/${project.slug}`)
    }
  }, [])

  const closeProject = useCallback(({ updateHistory = true } = {}) => {
    setActiveProject(null)
    setPageIndex(0)
    setHoveredProject(null)
    if (updateHistory && window.location.pathname !== '/projects') {
      window.history.pushState({}, '', '/projects')
    }
  }, [])

  const previousPage = useCallback(() => {
    if (!activeProject || pageIndex <= 0) return
    setPageDirection(-1)
    setPageIndex((value) => Math.max(0, value - 1))
  }, [activeProject, pageIndex])

  const nextPage = useCallback(() => {
    if (!activeProject || pageIndex >= currentPageCount - 1) return
    setPageDirection(1)
    setPageIndex((value) => Math.min(currentPageCount - 1, value + 1))
  }, [activeProject, pageIndex, currentPageCount])

  useEffect(() => {
    const onPopState = () => {
      const slug = slugFromPath()
      const project = slug ? findProject(slug) : null
      if (project?.interactive) openProject(project, { updateHistory: false })
      else closeProject({ updateHistory: false })
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && activeProject) closeProject()
      if (event.key === 'ArrowLeft' && activeProject) previousPage()
      if (event.key === 'ArrowRight' && activeProject) nextPage()
      if (event.key === 'Enter' && hoveredProject?.interactive && !activeProject) openProject(hoveredProject)
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeProject, hoveredProject, openProject, closeProject, previousPage, nextPage])

  const cursorLabel = useMemo(() => {
    if (hoveredProject?.interactive && !activeProject) return 'OPEN'
    return ''
  }, [hoveredProject, activeProject])

  return (
    <main className={`projects-shell ${activeProject ? 'is-reading' : ''}`}>
      <nav className="library-nav" aria-label="Projects navigation">
        <Link href="/" className="library-mark">MK</Link>
        <div>
          <Link href="/">Home</Link>
          <span>Projects</span>
          <a href="mailto:kapadiyamilind@gmail.com">Contact</a>
        </div>
      </nav>

      <div className="scene-layer" aria-hidden="true">
        <ProjectsScene
          activeProject={activeProject}
          hoveredProject={hoveredProject}
          pageIndex={pageIndex}
          pageDirection={pageDirection}
          onOpen={openProject}
          onHover={setHoveredProject}
          reducedMotion={reducedMotion}
        />
      </div>

      <ProjectOverlay
        activeProject={activeProject}
        hoveredProject={hoveredProject}
        pageIndex={pageIndex}
        onPrevious={previousPage}
        onNext={nextPage}
        onClose={closeProject}
      />

      <div
        className={`custom-cursor ${cursorLabel ? 'has-label' : ''}`}
        style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
        aria-hidden="true"
      >
        <span>{cursorLabel}</span>
      </div>

      <div className="accessible-project-list">
        <h2>Project index</h2>
        {interactiveProjects.map((project) => (
          <button key={project.id} onClick={() => openProject(project)}>
            <span>{project.title}</span>
            <small>{project.category} · {project.year}</small>
          </button>
        ))}
      </div>

      <div className="mobile-book-list" aria-label="Projects">
        <p>Pick a book</p>
        {interactiveProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => openProject(project)}
            style={{ '--book-color': project.book.color }}
          >
            <span>{project.title}</span>
            <small>{project.category}</small>
          </button>
        ))}
      </div>

      <ProjectLoader visible={loading} />
    </main>
  )
}
