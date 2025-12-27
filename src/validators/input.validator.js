import { LIMITS, ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/error.handler.js";

export class InputValidator {
  static validateIssueKey(issueKey) {
    if (!issueKey || typeof issueKey !== "string") {
      throw new AppError(ERROR_MESSAGES.ISSUE_KEY_REQUIRED, 400);
    }

    if (!LIMITS.ISSUE_KEY_PATTERN.test(issueKey)) {
      throw new AppError(ERROR_MESSAGES.ISSUE_KEY_INVALID, 400);
    }

    return issueKey;
  }

  static validateTitle(title) {
    if (!title || typeof title !== "string") {
      throw new AppError(ERROR_MESSAGES.TITLE_REQUIRED, 400);
    }

    if (title.length > LIMITS.TITLE_MAX_LENGTH) {
      throw new AppError(
        `${ERROR_MESSAGES.TITLE_TOO_LONG} (${LIMITS.TITLE_MAX_LENGTH})`,
        400
      );
    }

    return title;
  }

  static validateDescription(description) {
    if (description === null || description === undefined) {
      return "";
    }

    if (typeof description !== "string") {
      throw new AppError(ERROR_MESSAGES.DESCRIPTION_INVALID, 400);
    }

    if (description.length > LIMITS.DESCRIPTION_MAX_LENGTH) {
      throw new AppError(
        `${ERROR_MESSAGES.DESCRIPTION_TOO_LONG} (${LIMITS.DESCRIPTION_MAX_LENGTH})`,
        400
      );
    }

    return description;
  }

  static validateIssueData(title, description, issueKey) {
    return {
      title: this.validateTitle(title),
      description: this.validateDescription(description),
      issueKey: this.validateIssueKey(issueKey),
    };
  }
}
