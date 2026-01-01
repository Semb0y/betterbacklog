import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/error.handler.js";
import { Logger } from "../utils/logger.js";
import { validateAnalysisResponse } from "../validators.js";

export class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeIssue(title, description) {
    Logger.info("AnthropicService.analyzeIssue", "Starting analysis", {
      titleLength: title.length,
      descriptionLength: description.length,
    });

    const message = await this.client.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 4096,
      system: process.env.SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: this.buildPrompt(title, description),
        },
      ],
    });

    const responseText = message.content[0]?.text;

    if (!responseText) {
      throw new AppError(ERROR_MESSAGES.AI_NO_RESPONSE, 500);
    }

    const validation = validateAnalysisResponse(responseText);

    if (!validation.valid) {
      Logger.error("AnthropicService.analyzeIssue", "Invalid JSON response", {
        error: validation.error,
        rawResponse: responseText.substring(0, 200),
      });
      throw new AppError(
        `AI returned invalid format: ${validation.error}`,
        500
      );
    }

    Logger.info("AnthropicService.analyzeIssue", "Analysis completed", {
      model: MODELS.HAIKU,
      hasUserStory: !!validation.data.userStory,
      criteriaCount: validation.data.acceptanceCriteria?.length || 0,
    });

    return validation.data;
  }

  buildPrompt(title, description) {
    return `Analyze and improve this Jira issue:

Title: ${title}

Description: ${description || "No description provided"}`;
  }
}
