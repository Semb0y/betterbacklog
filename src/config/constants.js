export const LIMITS = {
  TITLE_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 10000,
  ISSUE_KEY_PATTERN: /^[A-Z]+-\d+$/,
};

export const MODELS = {
  HAIKU: "claude-haiku-4-5-20251001",
  SONNET: "claude-4-5-20250929",
};

export const ERROR_MESSAGES = {
  ISSUE_KEY_REQUIRED: "Issue key is required",
  ISSUE_KEY_INVALID: "Invalid issue key format",
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_LONG: `Title exceeds maximum length`,
  DESCRIPTION_INVALID: "Invalid description format",
  DESCRIPTION_TOO_LONG: `Description exceeds maximum length`,
  ISSUE_NOT_FOUND: "Issue not found",
  JIRA_FETCH_ERROR: "Unable to fetch issue from Jira",
  ANALYSIS_RETRIEVE_ERROR: "Unable to retrieve analysis",
  AI_NO_RESPONSE: "No response from AI",
  AI_ANALYSIS_ERROR: "Unable to analyze the issue. Please try again later.",
};

export const STORAGE_KEYS = {
  ANALYSIS_PREFIX: "analysis-",
};
