import React from "react";
import SectionMessage from "@atlaskit/section-message";
import { useTranslations } from "../../services/hooks/useTranslations";

export const ErrorMessage = ({ error, onRetry, onClose }) => {
  const t = useTranslations();

  if (!error) return null;

  const getErrorContent = (type) => {
    const errorType = type?.toUpperCase();
    const errorConfig = t.ERRORS[errorType] || t.ERRORS.UNKNOWN;
    return {
      title: errorConfig.TITLE,
      message: error.userMessage || errorConfig.MESSAGE,
    };
  };

  const getAppearance = (type) => {
    switch (type) {
      case "timeout":
      case "rate_limit":
      case "cooldown":
        return "warning";

      case "no_changes":
        return "information";

      default:
        return "error";
    }
  };

  const { title, message } = getErrorContent(error.type);
  const appearance = getAppearance(error.type);

  const actions = [];

  if (error.action === "retry" && onRetry) {
    actions.push({
      text: t.ACTIONS.TRY_AGAIN,
      onClick: onRetry,
    });
  }

  if (error.remainingSeconds) {
    const plural = error.remainingSeconds !== 1 ? "s" : "";
    const countdownMessage = t.ERRORS.COOLDOWN.MESSAGE_TEMPLATE.replace(
      "{seconds}",
      error.remainingSeconds
    ).replace("{plural}", plural);

    return (
      <SectionMessage appearance="warning" title={t.ERRORS.COOLDOWN.TITLE}>
        <p>{countdownMessage}</p>
      </SectionMessage>
    );
  }

  return (
    <SectionMessage appearance={appearance} title={title} actions={actions}>
      <p>{message}</p>
    </SectionMessage>
  );
};
