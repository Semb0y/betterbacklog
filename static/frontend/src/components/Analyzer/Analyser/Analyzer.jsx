import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { useIssueData } from "../../../services/hooks/useIssueData";
import { useAnalysisSync } from "../../../services/hooks/useAnalysisSync";
import {
  parseDescription,
  parseAnalysisResponse,
  formatDate,
} from "../../../services/utils";
import { AnalysisActions } from "../AnalysisActions/AnalysisActions";
import { Card } from "../../Card/Card";
import styles from "./Analyzer.module.css";

export const Analyzer = () => {
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
            userMessage:
              "This ticket hasn't been modified since the last analysis. The previous analysis is still valid.",
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
        setAnalysisDate(formatDate(result.date));
        setErrorDetails(null);
      } else {
        setErrorDetails({
          type: "invalid_response",
          userMessage:
            "The AI returned an unexpected format. Please try again.",
          action: "retry",
        });
      }
    } catch (e) {
      console.error("Error during AI analysis:", e);

      setErrorDetails({
        type: "network_error",
        userMessage:
          "Cannot connect to the server. Please check your internet connection and try again.",
        action: "retry",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActionDisabled = !issueKey || isLoading || isSyncing;

  return (
    <div className={styles.container}>
      <AnalysisActions
        onAnalyze={handleAnalyze}
        disabled={isActionDisabled}
        loading={isLoading || isSyncing}
        hasAnalysis={!!suggestion}
        errorDetails={errorDetails}
        onClearError={() => setErrorDetails(null)}
      />

      {suggestion && <Card suggestion={suggestion} date={analysisDate} />}
    </div>
  );
};
