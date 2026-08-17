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
            <p className="eyebrow">Yale Computer Science · Software Engineering</p>
            <h1 id="hero-title">I build useful software around data, AI, and the cloud.</h1>
            <p className="hero-copy">
              I&apos;m a Computer Science student at Yale University and an AI and Data Technology Intern at Crux Commercial
              Partners. I&apos;m interested in software engineering, AI, cloud computing, data systems, and robotics, and I&apos;m
              looking for internship opportunities where I can keep learning through practical engineering work.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View projects</a>
              <a className="button button-secondary" href="/Milind_Kapadiya_Resume.pdf" target="_blank" rel="noreferrer">
                Resume <Arrow />
              </a>
              <a className="text-link" href={`mailto:${email}`}>Email me</a>
            </div>
          </div>
          <aside className="hero-snapshot" aria-label="At a glance">
            <div>
              <span>Now</span>
              <strong>AI &amp; Data Technology Intern</strong>
              <p>Crux Commercial Partners</p>
            </div>
            <div>
              <span>Study</span>
              <strong>B.S. Computer Science</strong>
              <p>Yale University · GPA 3.81/4.0</p>
            </div>
            <div>
              <span>Focus</span>
              <strong>Software · AI · Cloud · Data</strong>
              <p>Building practical systems and learning by shipping.</p>
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
              I&apos;m a Yale Computer Science student who likes turning scattered or repetitive information into software that is
              easier to use. My current work gives me hands-on exposure to AI-assisted development, AWS cloud environments, and
              data workflows, while my independent projects let me explore product ideas from the ground up.
            </p>
            <p>
              I also mentor middle school students through Code Haven at Yale and have experience as a peer math tutor, which has
              made teaching and clear communication an important part of how I work with others.
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
                <span>July 2026 — Present</span>
              </div>
              <div className="timeline-body">
                <h3>AI and Data Technology Intern</h3>
                <ul>
                  <li>
                    Build AI-powered scrapers locally and deploy them into AWS cloud environments using Deep Learning Amazon
                    Machine Image (DLAMI) instances to support commercial real estate data collection workflows.
                  </li>
                  <li>
                    Contribute to internal automation while gaining hands-on experience with AI-assisted software development,
                    cloud computing, and large-scale data workflows under professional supervision.
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
                  <p className="project-type">Independent project · Aug 2026 — Present</p>
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
                A centralized housing catalog concept designed to make Yale room and residential-college information easier for
                students to find and compare.
              </p>
              <ul>
                <li>Built a working front-end prototype with residential-college selection, room search, and filtering.</li>
                <li>Structures room details such as occupancy, dimensions, floor, entrance, bathroom information, and notes.</li>
                <li>
                  Currently an independent prototype with starter data, designed with the longer-term goal of serving a broader
                  portion of the Yale student community.
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
                  <p className="project-type">Crux Commercial Partners · Summer 2026 — Present</p>
                  <h3>Commercial Real Estate Web Scrapers</h3>
                </div>
                <span className="project-status">Work project</span>
              </div>
              <p className="project-summary">
                Scraper workflows that turn repetitive commercial-property research into structured information for internal data
                processes.
              </p>
              <ul>
                <li>Develop and maintain scrapers that collect and organize commercial property information for internal use.</li>
                <li>Build locally, then deploy scraper workflows into AWS cloud environments using DLAMI instances.</li>
                <li>Structure reusable outputs so collected information can support downstream analysis and internal workflows.</li>
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
            <h2 id="skills-title">Technical ability</h2>
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
              <h3>Training</h3>
              <p>AWS Cloud Practitioner Essentials</p>
            </div>
            <div className="skill-group">
              <h3>Certification</h3>
              <p>AWS Certified Cloud Practitioner (CLF-C02) · In Progress</p>
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
                  <span>Aug 2025 — Present</span>
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
            <h2 id="community-title">Leadership &amp; community</h2>
          </div>
          <div className="section-content community-grid">
            <div>
              <h3>Code Haven at Yale</h3>
              <p>Mentor · Feb 2026 — Present</p>
              <span>Mentor middle school students through introductory coding projects and computer science concepts.</span>
            </div>
            <div>
              <h3>Math Tutoring Program</h3>
              <p>Student Founder &amp; Peer Tutor · Apr 2024 — May 2025</p>
              <span>Supported middle and high school students with foundational math skills and state exam preparation.</span>
            </div>
            <div>
              <h3>Yale Undergraduate Mentorship Initiative</h3>
              <p>Collaborations Committee · Oct 2025 — May 2026</p>
              <span>Helped connect students with graduate mentors and strengthen student-mentor engagement.</span>
            </div>
            <div>
              <h3>STARS I Program</h3>
              <p>Member · Aug 2025 — May 2026</p>
              <span>Participated in academic, professional-development, advising, and networking programming.</span>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="section-number">07</p>
          <h2 id="contact-title">Let&apos;s connect.</h2>
          <p>
            I&apos;m interested in software engineering internships and opportunities to keep building useful systems with thoughtful
            teams.
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
