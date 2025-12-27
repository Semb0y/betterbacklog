import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/error.handler.js";
import { Logger } from "../utils/logger.js";

export class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.systemPrompt =
      process.env.SYSTEM_PROMPT ||
      "You are a helpful assistant that improves Jira issue descriptions.";
  }

  async analyzeIssue(title, description) {
    Logger.info("AnthropicService.analyzeIssue", "Starting analysis", {
      titleLength: title.length,
      descriptionLength: description.length,
    });

    const message = await this.client.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: [
        {
          role: "user",
          content: this.buildPrompt(title, description),
        },
      ],
    });

    const improvedText = message.content[0]?.text;

    if (!improvedText) {
      throw new AppError(ERROR_MESSAGES.AI_NO_RESPONSE, 500);
    }

    Logger.info("AnthropicService.analyzeIssue", "Analysis completed", {
      outputLength: improvedText.length,
      model: MODELS.HAIKU,
    });

    return improvedText;
  }

  buildPrompt(title, description) {
    return `Analyze and improve this Jira issue:

Title: ${title}

Description: ${description || "No description provided"}

Please provide an improved version.`;
  }
}
