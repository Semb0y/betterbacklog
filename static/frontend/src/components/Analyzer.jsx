import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { useAnalysis } from "../hooks/useAnalysis";
import Button from "./ui/Button";
import { parseDescription } from "../utils";

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
    <div style={{ padding: "10px" }} >
      <Button
        onClick={handleAnalyzeAndImprove}
        disabled={loading || !issueKey}
        label={
          loading ? "Chargement" : "Analyser et améliorer le ticket"
        }
      />

      {aiAnalysis && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f4f5f7",
            borderRadius: "5px",
          }}
        >
          <h4>💡 Suggestion d'amelioration :</h4>
          <div style={{ whiteSpace: "pre-wrap" }}>{aiAnalysis}</div>
        </div>
      )}
    </div>
  );
};
