import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { useAnalysis } from "../../services/hooks";
import { parseDescription } from "../../services/utils";
import { Button } from "../ui/Button/Button";
import styles from "./Analyzer.module.css";

export const Analyzer = () => {
  const { runAnalysis } = useAnalysis();
  const [issueKey, setIssueKey] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    view.getContext().then((context) => {
      setIssueKey(context.extension.issue.key);
    });
  }, []);

  const handleAnalyzeAndImprove = async () => {
    if (!issueKey) return;

    setLoading(true);
    setAiAnalysis(null);

    try {
      const analysisData = await runAnalysis(issueKey);
      const parsedDescription = parseDescription(analysisData.description);

      const result = await invoke("improveBacklog", {
        title: analysisData.title,
        description: parsedDescription,
      });

      setAiAnalysis(result.improvedText);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={handleAnalyzeAndImprove}
        disabled={!issueKey}
        loading={loading}
      />

      {aiAnalysis && (
        <div className={styles.resultCard}>
          <h4 className={styles.resultHeader}>
            <span className={styles.resultIcon}>💡</span>
            Suggestion d'amélioration
          </h4>
          <div className={styles.resultContent}>{aiAnalysis}</div>
        </div>
      )}
    </div>
  );
};
