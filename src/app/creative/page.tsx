import { Column, Heading, Meta, Schema, Text, Row, SmartLink } from "@once-ui-system/core";
import { baseURL, about, person, creative } from "@/resources";
import { getPosts } from "@/utils/utils";
import { formatDate } from "@/utils/formatDate";

const CREATIVE_POSTS = ["src", "app", "creative", "projects"] as const;

function getVimeoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "vimeo.com" && u.hostname !== "www.vimeo.com") return null;
    const match = u.pathname.match(/^\/(\d+)(?:\/)?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return u.pathname.replace("/", "") || null;
    }
    if (host !== "youtube.com" && host !== "m.youtube.com") return null;
    if (u.pathname === "/watch") return u.searchParams.get("v");
    const match = u.pathname.match(/^\/embed\/([^/]+)$/) || u.pathname.match(/^\/shorts\/([^/]+)$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const vimeoId = getVimeoId(url);
  const youtubeId = getYouTubeId(url);

  let src: string | null = null;
  if (vimeoId) src = `https://player.vimeo.com/video/${vimeoId}`;
  if (youtubeId) src = `https://www.youtube.com/embed/${youtubeId}`;

  if (!src) return null;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "var(--radius-m)",
        overflow: "hidden",
        border: "1px solid var(--neutral-alpha-weak)",
        background: "var(--page-background)",
      }}
    >
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "0",
          }}
        />
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return Meta.generate({
    title: creative.title,
    description: creative.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(creative.title)}`,
    path: creative.path,
  });
}

export default function CreativePage() {
  const posts = getPosts([...CREATIVE_POSTS]).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={creative.path}
        title={creative.title}
        description={creative.description}
        image={`/api/og/generate?title=${encodeURIComponent(creative.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {creative.title}
      </Heading>
      <Column fillWidth gap="xl" paddingX="l" paddingBottom="40">
        {posts.map((post) => (
          <Column key={post.slug} fillWidth gap="12">
            <Row fillWidth horizontal="between" vertical="end" wrap gap="12">
              <Column gap="4">
                <Heading variant="heading-strong-l" wrap="balance">
                  {post.metadata.title}
                </Heading>
                {post.metadata.publishedAt ? (
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {formatDate(post.metadata.publishedAt, false)}
                  </Text>
                ) : null}
              </Column>
              {post.metadata.link ? (
                <SmartLink href={post.metadata.link}>
                  <Text variant="label-default-m" onBackground="brand-medium">
                    Open source video
                  </Text>
                </SmartLink>
              ) : null}
            </Row>
            {post.metadata.summary ? (
              <Text variant="body-default-m" onBackground="neutral-weak">
                {post.metadata.summary}
              </Text>
            ) : null}
            {typeof post.metadata.link === "string" && post.metadata.link ? (
              <VideoEmbed url={post.metadata.link} title={post.metadata.title} />
            ) : null}
          </Column>
        ))}
      </Column>
    </Column>
  );
}
