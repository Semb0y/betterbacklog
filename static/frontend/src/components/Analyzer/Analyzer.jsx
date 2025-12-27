import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { useIssueData } from "../../services/hooks";
import {
  parseDescription,
  formatDate,
  parseAnalysisResponse,
} from "../../services/utils";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import styles from "./Analyzer.module.css";

export const Analyzer = () => {
  const { runAnalysis, lastUpdated, refreshLastUpdated } = useIssueData();
  const [issueKey, setIssueKey] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [analysisDate, setAnalysisDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOutdated, setIsOutdated] = useState(false);

  useEffect(() => {
    view.getContext().then((context) => {
      setIssueKey(context.extension.issue.key);
    });
  }, []);

  useEffect(() => {
    if (!issueKey) return;

    refreshLastUpdated(issueKey);
    const interval = setInterval(() => refreshLastUpdated(issueKey), 5000);

    return () => clearInterval(interval);
  }, [issueKey, refreshLastUpdated]);

  useEffect(() => {
    if (!issueKey) {
      setIsSyncing(false);
      return;
    }

    const syncStorageWithJira = async () => {
      setIsSyncing(true);
      try {
        const savedData = await invoke("getLastAnalysis", { issueKey });

        if (savedData && savedData.improvedText) {
          const sorted = parseAnalysisResponse(savedData.improvedText);
          setSuggestion(sorted);

          setAnalysisDate(formatDate(savedData.date));

          if (lastUpdated) {
            const hasBeenModified =
              new Date(lastUpdated) > new Date(savedData.date);
            setIsOutdated(hasBeenModified);
          }
        }
      } catch (err) {
        console.error("Error syncing storage:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncStorageWithJira();
  }, [issueKey, lastUpdated]);

  const handleAnalyzeAction = async () => {
    if (!issueKey) return;
    setIsLoading(true);

    try {
      const currentIssue = await runAnalysis(issueKey);
      const result = await invoke("improveBacklog", {
        issueKey,
        title: currentIssue.title,
        description: parseDescription(currentIssue.description),
      });

      const sortedAnalysis = parseAnalysisResponse(result.improvedText);
      setSuggestion(sortedAnalysis);

      setAnalysisDate(formatDate(result.date));
      setIsOutdated(false);
    } catch (e) {
      console.error("Error during AI analysis:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const isActionDisabled =
    !issueKey || isLoading || isSyncing || (suggestion && !isOutdated);

  return (
    <div className={styles.container}>
      {(!suggestion || isOutdated) && (
        <Button
          onClick={handleAnalyzeAction}
          disabled={isActionDisabled}
          loading={isLoading || isSyncing}
          isOutdated={isOutdated}
          hasAnalysis={!!suggestion}
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
