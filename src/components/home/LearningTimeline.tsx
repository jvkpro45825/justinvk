import { Column, Heading, Row, Text, Badge } from "@once-ui-system/core";
import { learningTimeline } from "@/resources/learningTimeline";

export function LearningTimeline() {
  return (
    <Column fillWidth gap="l" maxWidth="s" horizontal="center" paddingTop="8">
      <Column fillWidth gap="8">
        <Heading as="h2" variant="heading-strong-l" wrap="balance">
          The journey
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Living timeline — edit milestones in{" "}
          <Text as="span" variant="label-default-m" onBackground="neutral-medium">
            src/resources/learningTimeline.ts
          </Text>
          .
        </Text>
      </Column>
      <Column fillWidth gap="12" marginTop="8">
        {learningTimeline.map((item) => (
          <Column
            key={item.title}
            fillWidth
            gap="12"
            padding="20"
            radius="m"
            border="neutral-alpha-medium"
            background="neutral-alpha-weak"
          >
            <Row gap="12" vertical="center" wrap>
              <Text variant="label-strong-s" onBackground="brand-medium">
                {item.phase}
              </Text>
              {item.current ? (
                <Badge onBackground="brand-weak" textVariant="label-default-s">
                  Current focus
                </Badge>
              ) : null}
            </Row>
            <Heading as="h3" variant="heading-strong-s" wrap="balance">
              {item.title}
            </Heading>
            <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
              {item.detail}
            </Text>
          </Column>
        ))}
      </Column>
    </Column>
  );
}
