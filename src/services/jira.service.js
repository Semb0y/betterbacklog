import api, { requestJira, route } from "@forge/api";
import { ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/error.handler.js";
import { Logger } from "../utils/logger.js";

export class JiraService {
  static async fetchIssue(issueKey) {
    Logger.info("JiraService.fetchIssue", "Fetching issue", { issueKey });

    const response = await requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description,updated`
    );

    if (!response.ok) {
      const errorText = await response.text();

      Logger.error(
        "JiraService.fetchIssue",
        "Jira API error",
        new Error(errorText),
        {
          status: response.status,
          statusText: response.statusText,
        }
      );

      if (response.status === 404) {
        throw new AppError(ERROR_MESSAGES.ISSUE_NOT_FOUND, 404);
      }

      throw new AppError(ERROR_MESSAGES.JIRA_FETCH_ERROR, response.status);
    }

    const data = await response.json();

    const issueData = {
      title: data.fields.summary || "",
      description: data.fields.description || "",
      updated: data.fields.updated || new Date().toISOString(),
    };

    Logger.info("JiraService.fetchIssue", "Issue fetched successfully", {
      issueKey,
      titleLength: issueData.title.length,
      descriptionLength: issueData.description.length,
    });

    return issueData;
  }

  static async getUserLocale() {
    try {
      const response = await api
        .asUser()
        .requestJira(route`/rest/api/3/myself`, {
          headers: {
            Accept: "application/json",
          },
        });

      if (!response.ok) {
        console.error("Jira API error:", response.status, response.statusText);
        const text = await response.text();
        console.error("Response:", text);
        return "en_US";
      }

      const data = await response.json();
      console.log("User data:", data);
      return data.locale || "en_US";
    } catch (error) {
      console.error("Failed to get user locale:", error);
      return "en_US";
    }
  }
}
