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
  const isChess = activeProject.id === 'chess'
  const isRunSpread = isChess && page?.showLinks

  return (
    <section className={`project-reader ${isChess ? 'is-chess-reader' : ''}`} aria-label={`${activeProject.title} project viewer`}>
      <button className="reader-close" onClick={onClose} aria-label="Close project">× CLOSE</button>

      <aside className="reader-left-page">
        <span className="reader-project-number">SPREAD {String(pageIndex + 1).padStart(2, '0')}</span>
        <strong>{activeProject.title}</strong>
        {activeProject.subtitle && <em>{activeProject.subtitle}</em>}
        <div className="reader-left-rule" />
        <span>{activeProject.category}</span>
        <span>{activeProject.year}</span>
        <span>{activeProject.role}</span>

        {isChess && pageIndex === 0 && activeProject.collaborators?.length > 0 && (
          <div className="reader-team">
            <small>Team</small>
            <p>{activeProject.collaborators.join(' · ')}</p>
          </div>
        )}

        {isChess && activeProject.tech?.length > 0 && (
          <div className="reader-tech" aria-label="Technologies used">
            {activeProject.tech.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
        )}
      </aside>

      <article className={`reader-copy ${isChess ? 'reader-copy-chess' : ''}`} key={`${activeProject.id}-${pageIndex}`}>
        <p>{page?.kicker}</p>
        <h2>{page?.title}</h2>
        <div className="reader-rule" />
        <span className="reader-body-copy">{page?.body}</span>

        {page?.items?.length > 0 && (
          <ul className="reader-detail-list">
            {page.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}

        {page?.visual && (
          <img className="reader-project-art" src={page.visual.src} alt={page.visual.alt} />
        )}

        {isRunSpread && (
          <div className="reader-run-panel">
            <div className="reader-actions" aria-label="Lux et Mat project links">
              {activeProject.links?.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label} ↗
                </a>
              ))}
            </div>

            <div className="reader-run-grid">
              <div>
                <strong>Mac</strong>
                <ol>
                  <li>Download and unzip the Mac build.</li>
                  <li>Keep <code>Lux-et-Mat.jar</code> and the <code>resources</code> folder together.</li>
                  <li>Confirm Java 8+ with <code>java -version</code>.</li>
                  <li>From that folder run <code>java -jar Lux-et-Mat.jar</code>.</li>
                </ol>
              </div>
              <div>
                <strong>Windows</strong>
                <ol>
                  <li>Download and unzip the Windows build.</li>
                  <li>Keep the included files together.</li>
                  <li>Double-click <code>Run-Lux-et-Mat.bat</code>.</li>
                  <li>Java 8 or newer is required.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </article>

      <div className="reader-controls" aria-label="Project spread navigation">
        <button onClick={onPrevious} disabled={pageIndex === 0} aria-label="Previous spread">←</button>
        <span>{String(pageIndex + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
        <button onClick={onNext} disabled={pageIndex >= pageCount - 1} aria-label="Next spread">→</button>
      </div>
    </section>
  )
}
