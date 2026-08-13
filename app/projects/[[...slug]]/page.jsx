import { findProject } from '../../../data/projects'
import ProjectsExperience from '../../../components/projects/ProjectsExperience'

export const metadata = {
  title: 'Projects',
  description: 'An interactive 3D library of projects by Milind Kapadiya.',
  alternates: { canonical: '/projects' },
}

export default async function ProjectsRoute({ params }) {
  const resolved = await params
  const requestedSlug = resolved?.slug?.[0] ?? null
  const initialProject = requestedSlug ? findProject(requestedSlug) : null

  return <ProjectsExperience initialSlug={initialProject?.slug ?? null} />
}
