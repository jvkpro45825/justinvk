import { getPosts } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

const DEFAULT_POSTS_PATH = ["src", "app", "creative", "projects"];
const DEFAULT_HREF_BASE = "/creative";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  /** MDX directory under project root (see `getPosts`) */
  postsPath?: string[];
  /** URL prefix for project detail links */
  hrefBase?: string;
}

export function Projects({
  range,
  exclude,
  postsPath = DEFAULT_POSTS_PATH,
  hrefBase = DEFAULT_HREF_BASE,
}: ProjectsProps) {
  let allProjects = getPosts(postsPath);

  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.slug}
          href={`${hrefBase}/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
