import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { Stack, Box, xcss } from "@atlaskit/primitives";
import { useIssueData } from "../../../services/hooks/useIssueData";
import { useAnalysisSync } from "../../../services/hooks/useAnalysisSync";
import { useTranslations } from "../../../services/hooks/useTranslations";
import { getUserLocale } from "../../../services/i18n";
import {
  parseDescription,
  parseAnalysisResponse,
  formatDate,
} from "../../../services/utils";
import { AnalysisActions } from "../AnalysisActions/AnalysisActions";
import { Card } from "../../Card/Card";

const containerStyles = xcss({
  paddingTop: "space.100",
});

export const Analyzer = () => {
  const t = useTranslations();
  const [issueKey, setIssueKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const { runAnalysis } = useIssueData();

  const {
    suggestion,
    setSuggestion,
    analysisDate,
    setAnalysisDate,
    isSyncing,
  } = useAnalysisSync(issueKey);

  useEffect(() => {
    view.getContext().then((context) => {
      setIssueKey(context.extension.issue.key);
    });
  }, []);

  const handleAnalyze = async () => {
    if (!issueKey) return;

    setIsLoading(true);
    setErrorDetails(null);

    try {
      const currentIssue = await runAnalysis(issueKey);
      const savedAnalysis = await invoke("getLastAnalysis", { issueKey });

      if (savedAnalysis && savedAnalysis.found) {
        const issueModifiedAt = new Date(currentIssue.updated);
        const lastAnalyzedAt = new Date(savedAnalysis.date);

        if (issueModifiedAt <= lastAnalyzedAt) {
          setErrorDetails({
            type: "no_changes",
            userMessage: t.ERRORS.NO_CHANGES.MESSAGE,
            action: "none",
          });
          return;
        }
      }

      const result = await invoke("improveBacklog", {
        issueKey,
        title: currentIssue.title,
        description: parseDescription(currentIssue.description),
      });

      if (!result.success) {
        setErrorDetails({
          type: result.type || "unknown",
          error: result.error,
          userMessage: result.userMessage || result.error,
          action: result.action || "retry",
          remainingSeconds: result.remainingSeconds,
        });
        return;
      }

      const parsed = parseAnalysisResponse(result.analysis);

      if (parsed) {
        setSuggestion(parsed);
        const locale = getUserLocale();
        setAnalysisDate(formatDate(result.date, locale));
        setErrorDetails(null);
      } else {
        setErrorDetails({
          type: "invalid_response",
          userMessage: t.ERRORS.INVALID_RESPONSE.MESSAGE,
          action: "retry",
        });
      }
    } catch (e) {
      console.error("Error during AI analysis:", e);

      setErrorDetails({
        type: "network_error",
        userMessage: t.ERRORS.NETWORK_ERROR.MESSAGE,
        action: "retry",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActionDisabled = !issueKey || isLoading || isSyncing;

  return (
    <Stack xcss={containerStyles}>
      <AnalysisActions
        onAnalyze={handleAnalyze}
        disabled={isActionDisabled}
        loading={isLoading || isSyncing}
        hasAnalysis={!!suggestion}
        errorDetails={errorDetails}
        onClearError={() => setErrorDetails(null)}
      />

      {suggestion && <Card suggestion={suggestion} date={analysisDate} />}

      <Box
        xcss={xcss({
          fontSize: "11px",
          color: "color.text.subtlest",
          fontStyle: "italic",
          paddingTop: "space.100",
        })}
      >
        {t.DISCLAIMER}
      </Box>
    </Stack>
  );
};
