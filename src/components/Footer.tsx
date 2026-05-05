import { Column, Row, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { footerCopy, person, social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Column as="footer" fillWidth padding="8" horizontal="center" gap="16">
      <Row
        maxWidth="m"
        paddingX="16"
        horizontal="center"
        s={{ direction: "column" }}
      >
        <Column gap="8" horizontal="center" maxWidth="m">
          <Text variant="body-default-m" onBackground="neutral-weak" style={{ fontStyle: "italic" }}>
            {footerCopy.tagline}
          </Text>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {footerCopy.cta}
          </Text>
        </Column>
      </Row>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            / Build your portfolio with{" "}
            <SmartLink href="https://once-ui.com/products/magic-portfolio">Once UI</SmartLink>
          </Text>
        </Text>
        <Row gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Column>
  );
};
