import { About, Blog, Creative, Gallery, Home, Newsletter, Person, Social } from "@/types";
import { Column, Heading, Line, Row, SmartLink, Text } from "@once-ui-system/core";
import { cs50pWeekCurrent } from "@/resources/learningTimeline";

/** Footer tagline + CTA (see Footer.tsx). */
export const footerCopy = {
  tagline:
    "I'm not the finished product — but I'm building toward it every day.",
  cta: (
    <>
      Follow the journey or reach out →{" "}
      <SmartLink href="https://justinvk.com">justinvk.com</SmartLink>
    </>
  ),
};

const person: Person = {
  firstName: "Justin",
  lastName: "Von Konsky",
  name: "Justin Von Konsky",
  role: "QA Automation & SDET in the making",
  avatar: "/images/justin-portrait.jpg",
  email: "j.vonkonsky@protonmail.com",
  location: "America/Phoenix",
  languages: ["English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Occasional updates on projects and learning</>,
};

const social: Social = [
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/jvkpro/",
    essential: true,
  },
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/jvkpro45825",
    essential: true,
  },
  {
    name: "Vimeo",
    icon: "vimeo",
    link: "https://vimeo.com/justinvk",
    essential: false,
  },
  {
    name: "YouTube",
    icon: "youtube",
    link: "https://www.youtube.com/channel/UC55y4Yr_6AnqJrcR-OOk0Yg",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} — QA automation, CS50P, SDET journey`,
  description: `Breaking things on purpose: QA automation & SDET in the making. CS50P, Python, call-center quality roots, documenting the journey.`,
  headline: <>Breaking Things on Purpose.</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Creative</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Video reel
        </Text>
      </Row>
    ),
    href: "/creative/reel-2024",
  },
  subline: (
    <>
      QA Automation & SDET in the making — documenting the journey, one test at a time.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `QA professional turning toward automation & SDET. CS50P, Python, call-center quality roots, dad of three. Phoenix.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "About Me",
    description: (
      <Column gap="24">
        <Text variant="body-default-l" onBackground="neutral-weak">
          Hey, I&apos;m Justin.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          I&apos;m a QA professional with a background in call center quality — scoring calls, running
          calibrations, coaching agents, and honestly just trying to make things better than I found
          them. After some real reflection on where I wanted to grow, I landed on QA Automation and
          SDET as my path forward into software.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          I&apos;m not a developer yet. But I&apos;m becoming one — and I&apos;m doing it out loud.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          I&apos;m currently working through CS50P, learning Python, and I built a custom AI mentor to
          push me harder than any course alone would. It&apos;s strict. I like it that way. Problems
          that should take an hour sometimes take days — but I&apos;m a busy dad of three (twins
          included) and I wouldn&apos;t trade the slow, hard lessons for shortcuts.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Along the way I&apos;ve also discovered I genuinely enjoy building things people use — Power
          BI dashboards, Power Automate workflows, Excel tools — things my organization actually
          relies on. That quiet realization is what pointed me toward software in the first place.
        </Text>
        <Text variant="body-default-l" onBackground="neutral-weak">
          This site is where I document all of it. The wins, the confusion, the &quot;why isn&apos;t
          this working&quot; moments, and the ones where it finally clicks.
        </Text>

        <Heading as="h2" variant="heading-strong-l" marginTop="8">
          What You&apos;ll Find Here
        </Heading>
        <Column gap="16">
          <Text variant="body-default-l" onBackground="neutral-weak">
            📋 <Text as="span" weight="strong">My Learning Journey</Text> — CS50P, Python, and
            everything after.
          </Text>
          <Text variant="body-default-l" onBackground="neutral-weak">
            🔧 <Text as="span" weight="strong">Projects & Test Work</Text> — Real code, real test
            suites, real mistakes.
          </Text>
          <Text variant="body-default-l" onBackground="neutral-weak">
            🤖 <Text as="span" weight="strong">AI-Assisted Learning</Text> — How I use AI as a strict
            mentor, not a shortcut.
          </Text>
          <Text variant="body-default-l" onBackground="neutral-weak">
            💡 <Text as="span" weight="strong">QA Thinking</Text> — Lessons from years of quality work,
            now applied to software.
          </Text>
        </Column>
      </Column>
    ),
  },
  work: {
    display: true,
    title: "Background",
    experiences: [
      {
        company: "Contact center quality & QA",
        timeframe: "Prior roles",
        role: "Call quality · calibrations · coaching",
        achievements: [
          <>
            Scoring calls, running calibrations, and coaching agents — the same eye for standards and
            consistency I&apos;m now aiming at software quality.
          </>,
          <>
            Grounded in making processes measurable and feedback actionable — a natural bridge into
            test design and automation mindset.
          </>,
        ],
        images: [],
      },
      {
        company: "Learning in public (now)",
        timeframe: "Present",
        role: "CS50P · Python · path toward automation",
        achievements: [
          <>
            Working through CS50P (currently Week {cs50pWeekCurrent}), documenting the messy middle —
            update your week in{" "}
            <Text variant="label-default-m">src/resources/learningTimeline.ts</Text>.
          </>,
          <>
            Building with tools my org already uses: Power BI, Power Automate, and Excel — proof that I
            like shipping things people rely on.
          </>,
          <>
            Strict AI-assisted mentorship: treating AI as a coach, not a crutch. Slow by choice;
            family-first schedule with three kids (including twins).
          </>,
        ],
        images: [],
      },
      {
        company: "Creative production",
        timeframe: "Parallel chapter",
        role: "Video · editing · aerial (Part 107)",
        achievements: [
          <>
            Long-form creative work lives under{" "}
            <SmartLink href="/creative">Creative</SmartLink> — separate from the engineering story, but
            part of how I think about craft and delivery.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false,
    title: "Studies",
    institutions: [],
  },
  technical: {
    display: true,
    title: "Currently Working With",
    skills: [
      {
        title: "Python & CS50P",
        description: (
          <>
            Harvard / edX Intro to Programming with Python — Week {cs50pWeekCurrent}; foundations for
            scripting and everything that comes next.
          </>
        ),
      },
      {
        title: "Playwright",
        description: (
          <>
            Browser automation — next up once the Python core feels solid.{" "}
            <Text as="span" onBackground="neutral-medium">
              <em>(coming soon)</em>
            </Text>
          </>
        ),
      },
      {
        title: "Power BI",
        description: <>Dashboards and reporting my team actually uses.</>,
      },
      {
        title: "Power Automate",
        description: <>Workflows that replace repetitive manual steps.</>,
      },
      {
        title: "Excel",
        description: <>Still one of the most deployed &quot;apps&quot; in any org — I meet people where they work.</>,
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Notes & updates",
  description: `Learning log, tests, wins, and rabbit holes — by ${person.firstName}.`,
};

const creative: Creative = {
  path: "/creative",
  label: "Creative",
  title: `Creative – ${person.name}`,
  description: `Video, editing, and aerial work — a parallel chapter to the QA / SDET journey.`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, creative, gallery };
