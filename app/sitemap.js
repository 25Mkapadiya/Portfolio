export default function sitemap() {
  const base = 'https://www.milindkapadiya.com'

  return [
    {
      url: base,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'monthly',
    },
  ]
}
