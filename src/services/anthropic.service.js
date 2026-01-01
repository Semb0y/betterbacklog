import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/error.handler.js";
import { Logger } from "../utils/logger.js";
import { validateAnalysisResponse } from "../validators.js";

export class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 30000,
    });
  }

  async callClaudeWithRetry(
    model,
    maxTokens,
    systemPrompt,
    messages,
    maxRetries = 1
  ) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const message = await this.client.messages.create({
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages,
        });

        return message;
      } catch (error) {
        lastError = error;

        const isServerError = error.status >= 500 && error.status < 600;
        const isTimeout =
          error.message?.includes("timeout") || error.code === "ETIMEDOUT";

        if (attempt === maxRetries || (!isServerError && !isTimeout)) {
          Logger.error("AnthropicService.callClaude", "API call failed", {
            attempt: attempt + 1,
            status: error.status,
            message: error.message,
            type: error.type,
          });
          throw error;
        }

        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 5000);
        Logger.warn(
          "AnthropicService.callClaude",
          `Retrying in ${backoffMs}ms`,
          {
            attempt: attempt + 1,
            maxRetries,
          }
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw lastError;
  }

  async analyzeIssue(title, description) {
    const startTime = Date.now();

    Logger.info("AnthropicService.analyzeIssue", "Starting analysis", {
      titleLength: title.length,
      descriptionLength: description.length,
      model: MODELS.HAIKU,
    });

    const message = await this.callClaudeWithRetry(
      MODELS.HAIKU,
      4096,
      process.env.SYSTEM_PROMPT,
      [
        {
          role: "user",
          content: this.buildPrompt(title, description),
        },
      ],
      1
    );

    const responseText = message.content[0]?.text;

    if (!responseText) {
      throw new AppError(ERROR_MESSAGES.AI_NO_RESPONSE, 500);
    }

    const validation = validateAnalysisResponse(responseText);

    if (!validation.valid) {
      Logger.error(
        "AnthropicService.analyzeIssue",
        "Invalid JSON response",
        new Error(validation.error),
        {
          ...Logger.getResponseMetadata(responseText),
          validationError: validation.error,
        }
      );
      throw new AppError(
        `AI returned invalid format: ${validation.error}`,
        500
      );
    }

    Logger.logAPICall("AnthropicService.analyzeIssue", "Analysis", startTime, {
      model: MODELS.HAIKU,
      satisfiedCount: validation.data.satisfied?.length || 0,
      notSatisfiedCount: validation.data.notSatisfied?.length || 0,
      partialCount: validation.data.partial?.length || 0,
      responseLength: responseText.length,
    });

    return validation.data;
  }

  buildPrompt(title, description) {
    return `Analyze and improve this Jira issue:

Title: ${title}

Description: ${description || "No description provided"}`;
  }
}
