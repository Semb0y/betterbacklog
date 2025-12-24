import { requestJira } from "@forge/bridge";
import { API_BASE_URL } from "./constants";

export const fetchAnalysis = async (issueKey) => {
  try {
    const response = await requestJira(
      `${API_BASE_URL}${issueKey}?fields=description,summary,updated`
    );
    const data = await response.json();
    return {
      title: data.fields.summary,
      description: data.fields.description,
      updated: data.fields.updated,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    throw error;
  }
};
