import { useParams } from "react-router-dom";
import { projectBySlug } from "../data/projects";
import CaseStudy from "./CaseStudy";
import ProjectDetail from "./ProjectDetail";
import { NotFound } from "./NotFound";

/** /projects/:slug: the long-form case study when one exists, otherwise the project page. */
export default function ProjectRoute() {
  const { slug } = useParams();
  const project = projectBySlug[slug];
  if (!project) return <NotFound />;
  return project.caseStudy ? <CaseStudy slug={slug} /> : <ProjectDetail project={project} />;
}
