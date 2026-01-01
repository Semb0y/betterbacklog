import { requestJira } from "@forge/bridge";

export const fetchIssue = async (issueKey) => {
  if (!issueKey) {
    throw new Error("Issue key is required");
  }

  try {
    const response = await requestJira(
      `/rest/api/3/issue/${issueKey}?fields=summary,description,updated`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch issue ${issueKey}: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.fields) {
      throw new Error(`Invalid response format for issue ${issueKey}`);
    }

    return {
      title: data.fields.summary || "",
      description: data.fields.description || null,
      updated: data.fields.updated || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch issue ${issueKey}:`, {
      error: error.message,
      issueKey,
    });
    throw error;
  }
};
