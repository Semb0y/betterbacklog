import { useState } from "react";
import { invoke } from "@forge/bridge";
import { parseDescription, formatDate, parseAnalysisResponse } from "../utils";
import { getUserLocale } from "../i18n";

export const useAnalysisAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const analyzeIssue = async (issueKey, runAnalysis, callbacks = {}) => {
    if (!issueKey) return;

    setIsLoading(true);
    setErrorDetails(null);

    try {
      const currentIssue = await runAnalysis(issueKey);

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
        return { success: false };
      }

      const parsed = parseAnalysisResponse(result.analysis);

      if (parsed) {
        const locale = await getUserLocale();
        const analysisDate = formatDate(result.date, locale);

        callbacks.onSuccess?.({
          suggestion: parsed,
          analysisDate,
        });

        setErrorDetails(null);
        return { success: true, data: { suggestion: parsed, analysisDate } };
      } else {
        setErrorDetails({
          type: "invalid_response",
          userMessage:
            "The AI returned an unexpected format. Please try again.",
          action: "retry",
        });
        return { success: false };
      }
    } catch (e) {
      console.error("Error during AI analysis:", e);

      setErrorDetails({
        type: "network_error",
        userMessage:
          "Cannot connect to the server. Please check your internet connection.",
        action: "retry",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorDetails,
    setErrorDetails,
    analyzeIssue,
  };
};
