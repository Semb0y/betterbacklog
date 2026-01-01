import React, { useEffect, useState } from "react";
import { view } from "@forge/bridge";
import { useAnalysisSync } from "../../../services/hooks/useAnalysisSync";
import { useAnalysisAction } from "../../../services/hooks/useAnalysisAction";
import { AnalysisActions } from "../AnalysisActions/AnalysisActions";
import styles from "./Analyzer.module.css";
import { useIssueData } from "../../../services/hooks/useIssueData";
import { Card } from "../../Card/Card";

export const Analyzer = () => {
  const [issueKey, setIssueKey] = useState(null);

  // ✅ Hook pour récupérer les données Jira
  const { runAnalysis, lastUpdated, refreshLastUpdated } = useIssueData();

  // ✅ Hook pour synchroniser avec le storage
  const {
    suggestion,
    setSuggestion,
    analysisDate,
    setAnalysisDate,
    isOutdated,
    setIsOutdated,
    isSyncing,
  } = useAnalysisSync(issueKey, lastUpdated);

  // ✅ Hook pour l'action d'analyse
  const { isLoading, errorDetails, setErrorDetails, analyzeIssue } =
    useAnalysisAction();

  // Récupérer l'issueKey du contexte Jira
  useEffect(() => {
    view.getContext().then((context) => {
      setIssueKey(context.extension.issue.key);
    });
  }, []);

  // Polling pour détecter les modifications du ticket
  useEffect(() => {
    if (!issueKey) return;

    refreshLastUpdated(issueKey);
    const interval = setInterval(() => refreshLastUpdated(issueKey), 5000);

    return () => clearInterval(interval);
  }, [issueKey, refreshLastUpdated]);

  // Handler pour l'analyse
  const handleAnalyze = async () => {
    const result = await analyzeIssue(issueKey, runAnalysis, {
      onSuccess: ({ suggestion: newSuggestion, analysisDate: newDate }) => {
        setSuggestion(newSuggestion);
        setAnalysisDate(newDate);
        setIsOutdated(false);
      },
    });
  };

  const isActionDisabled =
    !issueKey || isLoading || isSyncing || (suggestion && !isOutdated);

  return (
    <div className={styles.container}>
      {(!suggestion || isOutdated) && (
        <AnalysisActions
          onAnalyze={handleAnalyze}
          disabled={isActionDisabled}
          loading={isLoading || isSyncing}
          isOutdated={isOutdated}
          hasAnalysis={!!suggestion}
          errorDetails={errorDetails}
          onClearError={() => setErrorDetails(null)}
        />
      )}

      <Card
        suggestion={suggestion}
        date={analysisDate}
        isOutdated={isOutdated}
      />
    </div>
  );
};
