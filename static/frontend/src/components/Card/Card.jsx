import React from "react";
import { Box, Stack, Inline, xcss } from "@atlaskit/primitives";
import Lozenge from "@atlaskit/lozenge";
import { token } from "@atlaskit/tokens";
import { useTranslations } from "../../services/hooks/useTranslations";

const cardContainerStyles = xcss({
  backgroundColor: "elevation.surface.raised",
  padding: "space.200",
  borderRadius: "border.radius",
  borderWidth: "border.width",
  borderStyle: "solid",
  borderColor: "color.border",
  marginTop: "space.200",
  boxShadow: "elevation.shadow.raised",
});

const criterionBoxStyles = xcss({
  padding: "space.150",
  backgroundColor: "color.background.neutral.subtle",
  borderRadius: "border.radius",
  borderLeftWidth: "border.width.thick",
  borderLeftStyle: "solid",
});

export const Card = ({ suggestion, date }) => {
  const t = useTranslations();

  if (!suggestion) return null;

  if (
    !suggestion.satisfied ||
    !suggestion.notSatisfied ||
    !suggestion.partial
  ) {
    console.error("Invalid suggestion format:", suggestion);
    return null;
  }

  const renderSection = (items, title, appearance, borderColor) => {
    if (!items || items.length === 0) return null;

    return (
      <Stack space="space.150">
        <Inline space="space.100" alignBlock="center">
          <Lozenge appearance={appearance}>{title}</Lozenge>
        </Inline>

        <Stack space="space.100">
          {items.map((item, index) => (
            <Box
              key={index}
              xcss={[
                criterionBoxStyles,
                xcss({ borderLeftColor: borderColor }),
              ]}
            >
              <Stack space="space.050">
                <Box
                  xcss={xcss({
                    fontWeight: "font.weight.bold",
                    fontSize: "14px",
                  })}
                >
                  {item.criterion}
                </Box>
                <Box
                  xcss={xcss({
                    color: "color.text.subtle",
                    fontSize: "13px",
                    lineHeight: "20px",
                  })}
                >
                  {item.feedback}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    );
  };

  return (
    <Box xcss={cardContainerStyles}>
      <Stack space="space.300">
        <Box
          xcss={xcss({
            fontSize: "16px",
            fontWeight: "font.weight.semibold",
            color: "color.text",
          })}
        >
          ✨ {t.CARD.TITLE}
        </Box>

        {renderSection(
          suggestion.satisfied,
          t.CARD.STRENGTHS,
          t.LOZENGE_APPEARANCE.SUCCESS,
          token("color.border.success")
        )}

        {renderSection(
          suggestion.notSatisfied,
          t.CARD.CRITICAL_ISSUES,
          t.LOZENGE_APPEARANCE.REMOVED,
          token("color.border.danger")
        )}

        {renderSection(
          suggestion.partial,
          t.CARD.NEEDS_IMPROVEMENT,
          t.LOZENGE_APPEARANCE.MOVED,
          token("color.border.warning")
        )}

        {date && (
          <Box
            xcss={xcss({
              borderTopWidth: "border.width",
              borderTopStyle: "solid",
              borderTopColor: "color.border",
              paddingTop: "space.100",
              textAlign: "right",
            })}
          >
            <span
              style={{
                fontSize: "11px",
                color: token("color.text.subtlest"),
              }}
            >
              {t.CARD.FOOTER}
              {date}
            </span>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
