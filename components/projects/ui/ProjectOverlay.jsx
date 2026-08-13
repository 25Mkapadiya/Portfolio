'use client'

const projectPageUrl = 'https://25mkapadiya.github.io/Chess-3-Different-Versions-Lux-et-Mat-/'

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 32,
  padding: '7px 10px',
  border: '1px solid rgba(3,52,106,.3)',
  borderRadius: 999,
  color: '#03346a',
  textDecoration: 'none',
  font: '600 11px Arial, sans-serif',
  background: 'rgba(247,241,231,.72)',
}

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
        {activeProject.subtitle && <em style={{ fontSize: '.72rem', marginBottom: 12 }}>{activeProject.subtitle}</em>}
        <div className="reader-left-rule" />
        <span>{activeProject.category}</span>
        <span>{activeProject.year}</span>
        <span>{activeProject.role}</span>

        {isChess && pageIndex === 0 && activeProject.collaborators?.length > 0 && (
          <div style={{ marginTop: 12, maxWidth: 240 }}>
            <small style={{ display: 'block', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', opacity: .5 }}>Team</small>
            <p style={{ margin: '5px 0 0', fontFamily: 'Georgia, serif', fontSize: '.68rem', lineHeight: 1.35 }}>{activeProject.collaborators.join(' · ')}</p>
          </div>
        )}

        {isChess && activeProject.tech?.length > 0 && (
          <div aria-label="Technologies used" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12, maxWidth: 250 }}>
            {activeProject.tech.map((tech) => (
              <span key={tech} style={{ border: '1px solid rgba(60,49,42,.16)', borderRadius: 999, padding: '4px 7px', fontSize: '.46rem', lineHeight: 1 }}>
                {tech}
              </span>
            ))}
          </div>
        )}
      </aside>

      <article className={`reader-copy ${isChess ? 'reader-copy-chess' : ''}`} key={`${activeProject.id}-${pageIndex}`}>
        <p>{page?.kicker}</p>
        <h2>{page?.title}</h2>
        <div className="reader-rule" />
        <span className="reader-body-copy">{page?.body}</span>

        {page?.items?.length > 0 && (
          <ul style={{ margin: '13px 0 0', paddingLeft: 16, font: '400 11px/1.4 Arial, sans-serif', color: '#564d45' }}>
            {page.items.map((item) => <li key={item} style={{ marginBottom: 5 }}>{item}</li>)}
          </ul>
        )}

        {page?.visual && (
          <img src={page.visual.src} alt={page.visual.alt} style={{ width: 52, height: 52, objectFit: 'contain', marginTop: 10 }} />
        )}

        {isRunSpread && (
          <div style={{ marginTop: 12, pointerEvents: 'auto' }}>
            <div aria-label="Lux et Mat project links" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <a href={projectPageUrl} target="_blank" rel="noreferrer" style={linkStyle}>Project page ↗</a>
              {activeProject.links?.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" style={linkStyle}>
                  {link.label} ↗
                </a>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              <div style={{ borderTop: '1px solid rgba(51,43,37,.15)', paddingTop: 7 }}>
                <strong style={{ font: '700 10px Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '.09em' }}>Mac</strong>
                <ol style={{ margin: '6px 0 0', paddingLeft: 14, font: '400 9px/1.35 Arial, sans-serif' }}>
                  <li>Download and unzip the Mac build.</li>
                  <li>Keep the JAR and resources folder together.</li>
                  <li>Confirm Java 8+ with <code>java -version</code>.</li>
                  <li>Run <code>java -jar Lux-et-Mat.jar</code>.</li>
                </ol>
              </div>
              <div style={{ borderTop: '1px solid rgba(51,43,37,.15)', paddingTop: 7 }}>
                <strong style={{ font: '700 10px Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '.09em' }}>Windows</strong>
                <ol style={{ margin: '6px 0 0', paddingLeft: 14, font: '400 9px/1.35 Arial, sans-serif' }}>
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
