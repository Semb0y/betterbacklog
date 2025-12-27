import { requestJira, route } from "@forge/api";
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
}
