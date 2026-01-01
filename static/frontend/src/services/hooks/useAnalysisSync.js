import { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { parseAnalysisResponse, formatDate } from "../utils";

export const useAnalysisSync = (issueKey, lastUpdated) => {
  const [suggestion, setSuggestion] = useState(null);
  const [analysisDate, setAnalysisDate] = useState(null);
  const [isOutdated, setIsOutdated] = useState(false);
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

            if (lastUpdated) {
              const hasBeenModified =
                new Date(lastUpdated) > new Date(savedData.date);
              setIsOutdated(hasBeenModified);
            }
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

  return {
    suggestion,
    setSuggestion,
    analysisDate,
    setAnalysisDate,
    isOutdated,
    setIsOutdated,
    isSyncing,
  };
};
