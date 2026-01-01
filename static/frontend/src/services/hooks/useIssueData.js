import { useState, useCallback } from "react";
import { fetchAnalysis } from "../../api/index";

export const useIssueData = () => {
  const [issueData, setIssueData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadIssueData = useCallback(async (issueKey) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAnalysis(issueKey);
      setIssueData(result);
      return result;
    } catch (err) {
      console.error("Error loading issue data:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshLastUpdated = useCallback(async (issueKey) => {
    try {
      const result = await fetchAnalysis(issueKey);
      setIssueData(result);
      return result.updated;
    } catch (err) {
      console.error("Error refreshing last updated date:", err);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setIssueData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    issueData,
    lastUpdated: issueData?.updated || null,
    isLoading,
    error,
    runAnalysis: loadIssueData,
    refreshLastUpdated,
    reset,
  };
};
