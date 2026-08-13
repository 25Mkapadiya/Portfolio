import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="home-shell">
      <nav className="site-nav" aria-label="Primary">
        <Link href="/" className="site-mark">MK</Link>
        <div className="site-nav-links">
          <Link href="/projects">Projects</Link>
          <a href="#about">About</a>
          <a href="mailto:kapadiyamilind@gmail.com">Contact</a>
        </div>
      </nav>

      <section className="home-hero">
        <p className="home-kicker">Milind Kapadiya / Personal Portfolio</p>
        <h1>Developer.<br />Builder.<br /><span>Explorer.</span></h1>
        <p className="home-intro">
          I make useful digital things and experiment with the space between code, interaction and design.
        </p>
        <Link className="home-cta" href="/projects">Enter the project library <span>↗</span></Link>
      </section>

      <section className="home-about" id="about">
        <p>Selected work is being rebuilt as an interactive digital library.</p>
      </section>
    </main>
  )
}
