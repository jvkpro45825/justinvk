import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person } from "@/resources";
import { getPosts } from "@/utils/utils";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  const hasPosts = posts.length > 0;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {blog.title}
      </Heading>
      {hasPosts ? (
        <Column fillWidth flex={1} gap="40">
          <Posts range={[1, 1]} thumbnail />
          <Posts range={[2, 3]} columns="2" thumbnail direction="column" />
          <Mailchimp marginBottom="l" />
          <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
            Earlier posts
          </Heading>
          <Posts range={[4]} columns="2" />
        </Column>
      ) : (
        <Column fillWidth paddingX="24" paddingBottom="40" gap="12">
          <Text variant="body-default-l" onBackground="neutral-weak">
            No posts yet. Add a new{" "}
            <Text as="span" variant="label-default-m">
              .mdx
            </Text>{" "}
            file under{" "}
            <Text as="span" variant="label-default-m">
              src/app/blog/posts/
            </Text>
            — each file becomes a post at{" "}
            <Text as="span" variant="label-default-m">
              /blog/&lt;filename&gt;
            </Text>
            .
          </Text>
        </Column>
      )}
    </Column>
  );
}
