import './globals.css'
import './projects-scroll.css'
import './reader.css'

export const metadata = {
  metadataBase: new URL('https://www.milindkapadiya.com'),
  title: {
    default: 'Milind Kapadiya — Portfolio',
    template: '%s — Milind Kapadiya',
  },
  description:
    'Milind Kapadiya — personal portfolio featuring development, interactive experiments, and 3D work.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Milind Kapadiya — Portfolio',
    description: 'Development, interactive experiments, and 3D work.',
    url: 'https://www.milindkapadiya.com',
    siteName: 'Milind Kapadiya',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
