import { InputValidator } from "../validators/input.validator.js";
import { JiraService } from "../services/jira.service.js";
import { AnthropicService } from "../services/anthropic.service.js";
import { StorageService } from "../services/storage.service.js";
import { ErrorHandler, AppError } from "../utils/error.handler.js";
import { MODELS, ERROR_MESSAGES } from "../config/constants.js";

export class IssueResolver {
  constructor() {
    this.anthropicService = new AnthropicService();
  }

  async fetchAnalysis(req) {
    return ErrorHandler.wrap("IssueResolver.fetchAnalysis", async () => {
      const { issueKey } = req.payload;
      InputValidator.validateIssueKey(issueKey);

      return await JiraService.fetchIssue(issueKey);
    })();
  }

  async improveBacklog(req) {
    return ErrorHandler.wrap("IssueResolver.improveBacklog", async () => {
      const { title, description, issueKey } = req.payload;

      const validated = InputValidator.validateIssueData(
        title,
        description,
        issueKey
      );

      let analysisJson;
      try {
        analysisJson = await this.anthropicService.analyzeIssue(
          validated.title,
          validated.description
        );
      } catch (error) {
        throw new AppError(ERROR_MESSAGES.AI_ANALYSIS_ERROR, 500);
      }

      const analysisData = await StorageService.saveAnalysis(
        validated.issueKey,
        analysisJson,
        { model: MODELS.HAIKU }
      );

      return {
        success: true,
        analysis: analysisData.improvedText,
        date: analysisData.date,
      };
    })();
  }
}
