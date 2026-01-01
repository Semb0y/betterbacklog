import { useCallback } from "react";
import { fetchIssue } from "../../api/index";

/**
 * Hook pour récupérer les données d'un ticket Jira
 * Utilisé uniquement lors de l'analyse (on-demand)
 */
export const useIssueData = () => {
  /**
   * Charge les données complètes du ticket
   * Appelé uniquement lors du clic "Analyser"
   */
  const runAnalysis = useCallback(async (issueKey) => {
    try {
      const result = await fetchIssue(issueKey);
      return result;
    } catch (err) {
      console.error("Failed to load issue data:", err);
      throw err;
    }
  }, []);

  return {
    runAnalysis,
  };
};
