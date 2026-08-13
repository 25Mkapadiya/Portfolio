import { interactiveProjects } from '../data/projects'

export default function sitemap() {
  const base = 'https://www.milindkapadiya.com'
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), priority: 0.9 },
    ...interactiveProjects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ]
}
