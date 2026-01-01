import { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { parseAnalysisResponse, formatDate } from "../utils";

export const useAnalysisSync = (issueKey) => {
  const [suggestion, setSuggestion] = useState(null);
  const [analysisDate, setAnalysisDate] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!issueKey) {
      setIsSyncing(false);
      return;
    }

    const syncStorageWithJira = async () => {
      setIsSyncing(true);
      try {
        const savedData = await invoke("getLastAnalysis", { issueKey });

        if (savedData && savedData.found && savedData.improvedText) {
          const parsed = parseAnalysisResponse(savedData.improvedText);

          if (parsed) {
            setSuggestion(parsed);
            setAnalysisDate(formatDate(savedData.date));
          }
        }
      } catch (err) {
        console.error("Error syncing storage:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncStorageWithJira();
  }, [issueKey]);

  return {
    suggestion,
    setSuggestion,
    analysisDate,
    setAnalysisDate,
    isSyncing,
  };
};
