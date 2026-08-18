const githubUrl = 'https://github.com/25Mkapadiya'
const linkedinUrl = 'https://www.linkedin.com/in/milind-kapadiya'
const email = 'milind.kapadiya@yale.edu'

const Arrow = () => <span aria-hidden="true">↗</span>

export default function HomePage() {
  return (
    <main className="simple-portfolio" id="top">
      <header className="portfolio-header">
        <a className="portfolio-name" href="#top" aria-label="Milind Kapadiya, back to top">
          Milind Kapadiya
        </a>
        <nav className="portfolio-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="portfolio-nav-actions" aria-label="Profile links">
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile, opens in a new tab">
            GitHub <Arrow />
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile, opens in a new tab">
            LinkedIn <Arrow />
          </a>
        </div>
      </header>

      <div className="portfolio-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-main">
            <p className="eyebrow">Computer Science at Yale University</p>
            <h1 id="hero-title">Hey, I&apos;m Milind.</h1>
            <p className="hero-copy">
              I&apos;m a CS student at Yale and an AI and Data Technology Intern at Crux Commercial Partners. Right now I&apos;m
              getting hands-on experience with web scraping, AWS, AI-assisted development, and data workflows while building a few
              projects of my own along the way.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">See what I&apos;m building</a>
              <a className="button button-secondary" href="/Milind_Kapadiya_Resume.pdf" target="_blank" rel="noreferrer">
                Resume <Arrow />
              </a>
              <a className="text-link" href={`mailto:${email}`}>Email me</a>
            </div>
          </div>
          <aside className="hero-snapshot" aria-label="At a glance">
            <div>
              <span>Currently</span>
              <strong>AI &amp; Data Technology Intern</strong>
              <p>Crux Commercial Partners</p>
            </div>
            <div>
              <span>Studying</span>
              <strong>B.S. Computer Science</strong>
              <p>Yale University · GPA 3.81/4.0</p>
            </div>
            <div>
              <span>Interested in</span>
              <strong>Software, AI, cloud, and robotics</strong>
              <p>Still exploring, mostly by building things.</p>
            </div>
          </aside>
        </section>

        <section className="portfolio-section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-number">01</p>
            <h2 id="about-title">About</h2>
          </div>
          <div className="section-content about-copy">
            <p>
              I&apos;m still early in my CS path, so I try to learn by working on real problems instead of only keeping things in the
              classroom. My internship at Crux has given me a chance to work with cloud-based data workflows, while my own projects
              let me experiment with ideas from the ground up.
            </p>
            <p>
              Outside of my technical work, I mentor middle school students through Code Haven at Yale and have also worked as a
              peer math tutor. Teaching has been a good reminder that being able to explain something clearly matters just as much as
              getting it to work.
            </p>
          </div>
        </section>

        <section className="portfolio-section" id="experience" aria-labelledby="experience-title">
          <div className="section-heading">
            <p className="section-number">02</p>
            <h2 id="experience-title">Experience</h2>
          </div>
          <div className="section-content">
            <article className="timeline-item featured-item">
              <div className="timeline-meta">
                <p>Crux Commercial Partners</p>
                <span>July 2026 to Present</span>
              </div>
              <div className="timeline-body">
                <h3>AI and Data Technology Intern</h3>
                <ul>
                  <li>
                    I build web scrapers locally and deploy them into AWS environments using Deep Learning Amazon Machine Image
                    (DLAMI) instances.
                  </li>
                  <li>
                    The work helps turn repetitive commercial real estate research into structured information that can be reused in
                    internal data workflows.
                  </li>
                </ul>
                <div className="tag-list" aria-label="Experience areas">
                  <span>AWS</span>
                  <span>DLAMI</span>
                  <span>AI-assisted development</span>
                  <span>Data workflows</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="portfolio-section projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <p className="section-number">03</p>
            <h2 id="projects-title">Projects</h2>
          </div>
          <div className="section-content project-list">
            <article className="project-item">
              <div className="project-topline">
                <div>
                  <p className="project-type">Independent project · Aug 2026 to Present</p>
                  <h3>Yale Housing Catalog</h3>
                </div>
                <a
                  className="project-link"
                  href="https://github.com/25Mkapadiya/Yale-Housing-Project"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View Yale Housing Catalog source on GitHub, opens in a new tab"
                >
                  GitHub <Arrow />
                </a>
              </div>
              <p className="project-summary">
                I&apos;m building one place where Yale students can browse and compare housing information without having to piece it
                together themselves.
              </p>
              <ul>
                <li>The current prototype includes residential college selection, room search, and filtering.</li>
                <li>Room entries can include occupancy, dimensions, floor, entrance, bathroom information, and notes.</li>
                <li>
                  It is still an independent project with starter data, but I&apos;m designing it with the possibility of supporting a
                  larger part of the Yale community later on.
                </li>
              </ul>
              <div className="tag-list" aria-label="Yale Housing Catalog technologies">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
              </div>
            </article>

            <article className="project-item">
              <div className="project-topline">
                <div>
                  <p className="project-type">Crux Commercial Partners · Summer 2026 to Present</p>
                  <h3>Commercial Real Estate Web Scrapers</h3>
                </div>
                <span className="project-status">Work project</span>
              </div>
              <p className="project-summary">
                A set of scraper workflows I work on at Crux to make property research less repetitive and the resulting data easier
                to use again later.
              </p>
              <ul>
                <li>I develop and maintain scrapers that collect and organize commercial property information for internal use.</li>
                <li>I build locally first, then move scraper workflows into AWS cloud environments using DLAMI instances.</li>
                <li>The output is structured so it can feed later analysis and other internal data processes.</li>
              </ul>
              <div className="tag-list" aria-label="Commercial real estate scraper technologies and areas">
                <span>AWS</span>
                <span>DLAMI</span>
                <span>Web scraping</span>
                <span>Data workflows</span>
              </div>
            </article>
          </div>
        </section>

        <section className="portfolio-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="section-number">04</p>
            <h2 id="skills-title">Tools &amp; skills</h2>
          </div>
          <div className="section-content skills-grid">
            <div className="skill-group">
              <h3>Languages</h3>
              <p>Python · Java · JavaScript · C++ · Racket</p>
            </div>
            <div className="skill-group">
              <h3>Cloud &amp; development</h3>
              <p>AWS · DLAMI · Claude Code · VS Code</p>
            </div>
            <div className="skill-group">
              <h3>AWS training</h3>
              <p>AWS Cloud Practitioner Essentials</p>
            </div>
            <div className="skill-group">
              <h3>In progress</h3>
              <p>AWS Certified Cloud Practitioner (CLF-C02)</p>
            </div>
          </div>
        </section>

        <section className="portfolio-section" id="education" aria-labelledby="education-title">
          <div className="section-heading">
            <p className="section-number">05</p>
            <h2 id="education-title">Education</h2>
          </div>
          <div className="section-content education-list">
            <article className="education-item">
              <div className="education-title-row">
                <div>
                  <h3>Yale University</h3>
                  <p>Bachelor of Science in Computer Science</p>
                </div>
                <div className="education-date">
                  <span>Aug 2025 to Present</span>
                  <strong>GPA 3.81/4.0</strong>
                </div>
              </div>
              <div className="coursework-grid">
                <div>
                  <h4>Completed coursework</h4>
                  <p>Intro to Programming · Intro to Computer Science · Math Tools for Computer Science</p>
                </div>
                <div>
                  <h4>Upcoming coursework</h4>
                  <p>Intelligent Robotics · Data Structures · Systems Programming · Intro to Ethics</p>
                </div>
              </div>
            </article>

            <article className="education-item study-abroad">
              <div className="education-title-row">
                <div>
                  <p className="project-type">Study abroad</p>
                  <h3>Yale University · London, UK</h3>
                  <p>Challenges to Democracy in Contemporary Europe (S3470)</p>
                </div>
                <div className="education-date">
                  <span>Summer 2026</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="portfolio-section" id="community" aria-labelledby="community-title">
          <div className="section-heading">
            <p className="section-number">06</p>
            <h2 id="community-title">Outside of class</h2>
          </div>
          <div className="section-content community-grid">
            <div>
              <h3>Code Haven at Yale</h3>
              <p>Mentor · Feb 2026 to Present</p>
              <span>I mentor middle school students through introductory coding projects and computer science concepts.</span>
            </div>
            <div>
              <h3>Math Tutoring Program</h3>
              <p>Student Founder &amp; Peer Tutor · Apr 2024 to May 2025</p>
              <span>I helped middle and high school students strengthen foundational math skills and prepare for state exams.</span>
            </div>
            <div>
              <h3>Yale Undergraduate Mentorship Initiative</h3>
              <p>Collaborations Committee · Oct 2025 to May 2026</p>
              <span>I helped connect students with graduate mentors and supported student-mentor engagement.</span>
            </div>
            <div>
              <h3>STARS I Program</h3>
              <p>Member · Aug 2025 to May 2026</p>
              <span>I took part in academic, professional development, advising, and networking programming.</span>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="section-number">07</p>
          <h2 id="contact-title">Get in touch.</h2>
          <p>
            I&apos;m currently looking for software engineering internship opportunities and always happy to talk about projects,
            school, or what I&apos;m learning next.
          </p>
          <div className="contact-links">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
            <a href="/Milind_Kapadiya_Resume.pdf" target="_blank" rel="noreferrer">Resume <Arrow /></a>
          </div>
        </section>
      </div>

      <footer className="portfolio-footer">
        <p>Milind Kapadiya · Computer Science at Yale</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  )
}
