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

      // Rate limiting
      const existingAnalysis = await StorageService.getAnalysis(
        validated.issueKey
      );

      if (existingAnalysis) {
        const analysisDate = new Date(existingAnalysis.date);
        const now = new Date();
        const diffSeconds = (now - analysisDate) / 1000;

        if (diffSeconds < 30) {
          return {
            success: false,
            error: "Please wait before re-analyzing",
            type: "cooldown",
            remainingSeconds: Math.ceil(30 - diffSeconds),
            // ✅ NOUVEAU : Message actionnable
            userMessage: `Please wait ${Math.ceil(30 - diffSeconds)} seconds before analyzing again.`,
            action: "wait",
          };
        }
      }

      // Analyse IA
      let analysisJson;
      try {
        analysisJson = await this.anthropicService.analyzeIssue(
          validated.title,
          validated.description
        );
      } catch (error) {
        // ✅ NOUVEAU : Détection du type d'erreur
        const errorType = this.categorizeError(error);

        return {
          success: false,
          error: error.message,
          type: errorType.type,
          userMessage: errorType.message,
          action: errorType.action,
        };
      }

      // Sauvegarde
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

  // ✅ NOUVEAU : Catégoriser les erreurs
  categorizeError(error) {
    // Timeout
    if (error.message?.includes("timeout") || error.code === "ETIMEDOUT") {
      return {
        type: "timeout",
        message:
          "The AI service took too long to respond. This can happen with complex tickets.",
        action: "retry",
      };
    }

    // Rate limit Anthropic
    if (error.status === 429) {
      return {
        type: "rate_limit",
        message: "Too many requests to the AI service. Please wait a moment.",
        action: "wait",
      };
    }

    // Erreur serveur Anthropic (5xx)
    if (error.status >= 500 && error.status < 600) {
      return {
        type: "ai_unavailable",
        message:
          "The AI service is temporarily unavailable. Please try again in a few minutes.",
        action: "retry_later",
      };
    }

    // Invalid JSON response
    if (error.message?.includes("invalid format")) {
      return {
        type: "invalid_response",
        message:
          "The AI returned an unexpected response format. Please try again.",
        action: "retry",
      };
    }

    // Erreur générique
    return {
      type: "unknown",
      message:
        "An unexpected error occurred. If this persists, please contact your Jira administrator.",
      action: "contact_admin",
    };
  }
}
