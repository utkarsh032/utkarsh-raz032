import { useParams } from "react-router-dom";
import { projectBySlug } from "../data/projects";
import ProjectPage from "./ProjectPage";
import { NotFound } from "./NotFound";

/** /projects/:slug. Keyed by slug so moving between projects starts each page fresh. */
export default function ProjectRoute() {
  const { slug } = useParams();
  const project = projectBySlug[slug];
  if (!project) return <NotFound />;
  return <ProjectPage key={slug} project={project} />;
}
