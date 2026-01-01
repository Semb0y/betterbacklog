export const validateAnalysisResponse = (text) => {
  let cleaned = text.trim();

  cleaned = cleaned.replace(/```json\n?/g, "");
  cleaned = cleaned.replace(/```\n?/g, "");
  cleaned = cleaned.trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    return {
      valid: false,
      error: "Response is not valid JSON",
      details: error.message,
    };
  }

  const requiredSections = ["satisfied", "notSatisfied", "partial"];

  for (const section of requiredSections) {
    if (!Array.isArray(parsed[section])) {
      return {
        valid: false,
        error: `Missing or invalid '${section}' array`,
      };
    }

    for (const item of parsed[section]) {
      if (!item.criterion || typeof item.criterion !== "string") {
        return {
          valid: false,
          error: `Invalid 'criterion' in ${section} section`,
        };
      }

      if (!item.feedback || typeof item.feedback !== "string") {
        return {
          valid: false,
          error: `Invalid 'feedback' in ${section} section`,
        };
      }
    }
  }

  const allCriteria = [
    ...parsed.satisfied.map((i) => i.criterion),
    ...parsed.notSatisfied.map((i) => i.criterion),
    ...parsed.partial.map((i) => i.criterion),
  ];

  const criteriaCount = allCriteria.length;

  if (criteriaCount !== 6) {
    return {
      valid: false,
      error: `Expected exactly 6 criteria, found ${criteriaCount}`,
    };
  }

  return {
    valid: true,
    data: parsed,
  };
};
