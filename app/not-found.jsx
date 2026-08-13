import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found">
      <p>That page is not in the library.</p>
      <Link href="/projects">Return to projects</Link>
    </main>
  )
}
