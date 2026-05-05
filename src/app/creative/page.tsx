import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, creative } from "@/resources";
import { Projects } from "@/components/work/Projects";

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
      <Projects />
    </Column>
  );
}
