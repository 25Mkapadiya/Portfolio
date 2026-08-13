'use client'

export default function ProjectLoader({ visible }) {
  return (
    <div className={`library-loader ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <div className="loader-book" aria-hidden="true">
        <span className="loader-cover" />
        <span className="loader-page loader-page-one" />
        <span className="loader-page loader-page-two" />
        <span className="loader-page loader-page-three" />
      </div>
      <p>Opening the library</p>
    </div>
  )
}
