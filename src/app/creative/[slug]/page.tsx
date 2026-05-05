import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import {
  Meta,
  Schema,
  AvatarGroup,
  Column,
  Flex,
  Heading,
  Text,
  SmartLink,
  Row,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, creative } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";

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
        maxWidth: "var(--static-width-m)",
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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts([...CREATIVE_POSTS]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts([...CREATIVE_POSTS]);
  const post = posts.find((p) => p.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${creative.path}/${post.slug}`,
  });
}

export default async function CreativeProject({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = getPosts([...CREATIVE_POSTS]).find((p) => p.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((member) => ({
      src: member.avatar,
    })) || [];

  const hasTeam = post.metadata.team && post.metadata.team.length > 0;

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${creative.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href={creative.path}>
          <Text variant="label-strong-m">Creative</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{post.metadata.title}</Heading>
      </Column>
      {hasTeam ? (
        <Row marginBottom="32" horizontal="center">
          <Row gap="16" vertical="center">
            <AvatarGroup reverse avatars={avatars} size="s" />
            <Text variant="label-default-m" onBackground="brand-weak">
              {post.metadata.team?.map((member, idx) => (
                <span key={idx}>
                  {idx > 0 && (
                    <Text as="span" onBackground="neutral-weak">
                      ,{" "}
                    </Text>
                  )}
                  <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
                </span>
              ))}
            </Text>
          </Row>
        </Row>
      ) : (
        <Flex marginBottom="16" />
      )}
      {typeof post.metadata.link === "string" && post.metadata.link ? (
        <VideoEmbed url={post.metadata.link} title={post.metadata.title} />
      ) : null}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={post.content} />
      </Column>
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          More creative work
        </Heading>
        <Projects exclude={[post.slug]} range={[2]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
