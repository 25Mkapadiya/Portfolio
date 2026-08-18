import './globals.css'
import './portfolio.css'
import './portfolio-polish.css'

export const metadata = {
  metadataBase: new URL('https://www.milindkapadiya.com'),
  title: {
    default: 'Milind Kapadiya | Computer Science',
    template: '%s | Milind Kapadiya',
  },
  description:
    'Milind Kapadiya is a Yale Computer Science student building software across AI-assisted development, AWS cloud environments, data workflows, and independent projects.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Milind Kapadiya | Computer Science',
    description:
      'Yale Computer Science student with experience in AI-assisted software development, AWS cloud environments, data workflows, and independent software projects.',
    url: 'https://www.milindkapadiya.com',
    siteName: 'Milind Kapadiya',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Milind Kapadiya | Computer Science',
    description: 'Yale Computer Science student building software across AI, cloud, and data workflows.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
