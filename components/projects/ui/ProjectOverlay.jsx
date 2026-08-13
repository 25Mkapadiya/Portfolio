'use client'

export default function ProjectOverlay({
  activeProject,
  hoveredProject,
  pageIndex,
  onPrevious,
  onNext,
  onClose,
}) {
  if (!activeProject) {
    return (
      <>
        <div className="projects-title-block">
          <p>Selected work / 2026</p>
          <h1>Projects</h1>
          <span>Pick a book.</span>
        </div>
        <div className={`hover-label ${hoveredProject ? 'is-visible' : ''}`} aria-live="polite">
          {hoveredProject && (
            <>
              <span>{hoveredProject.category}</span>
              <strong>{hoveredProject.title}</strong>
            </>
          )}
        </div>
        <div className="projects-instruction">Scroll to wind through the library · Hover to inspect · Click to open</div>
      </>
    )
  }

  const page = activeProject.pages?.[pageIndex]
  const pageCount = activeProject.pages?.length ?? 1

  return (
    <section className="project-reader" aria-label={`${activeProject.title} project viewer`}>
      <button className="reader-close" onClick={onClose} aria-label="Close project">× CLOSE</button>

      <aside className="reader-left-page" aria-hidden="true">
        <span className="reader-project-number">SPREAD {String(pageIndex + 1).padStart(2, '0')}</span>
        <strong>{activeProject.title}</strong>
        <div className="reader-left-rule" />
        <span>{activeProject.category}</span>
        <span>{activeProject.year}</span>
        <span>{activeProject.role}</span>
      </aside>

      <article className="reader-copy" key={`${activeProject.id}-${pageIndex}`}>
        <p>{page?.kicker}</p>
        <h2>{page?.title}</h2>
        <div className="reader-rule" />
        <span>{page?.body}</span>
      </article>

      <div className="reader-controls">
        <button onClick={onPrevious} disabled={pageIndex === 0} aria-label="Previous page">←</button>
        <span>{String(pageIndex + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
        <button onClick={onNext} disabled={pageIndex >= pageCount - 1} aria-label="Next page">→</button>
      </div>
    </section>
  )
}
