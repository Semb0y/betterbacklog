export const ANALYSIS_SCHEMA = {
  satisfied: [
    {
      criterion: "string - Nom du critère évalué",
      feedback: "string - Explication courte + recommandation",
    },
  ],
  notSatisfied: [
    {
      criterion: "string - Nom du critère évalué",
      feedback: "string - Explication courte + recommandation",
    },
  ],
  partial: [
    {
      criterion: "string - Nom du critère évalué",
      feedback: "string - Explication courte + recommandation",
    },
  ],
};

export const ANALYSIS_EXAMPLE = {
  satisfied: [
    {
      criterion: "Independence",
      feedback:
        "The story can be developed without blocking other work. No hidden dependencies detected.",
    },
    {
      criterion: "Value",
      feedback:
        "Clear user benefit: faster profile updates improve user experience. Value is explicit.",
    },
  ],
  notSatisfied: [
    {
      criterion: "Testability",
      feedback:
        "Acceptance criteria are too vague. Add specific scenarios: valid/invalid email, character limits, error messages.",
    },
  ],
  partial: [
    {
      criterion: "Small",
      feedback:
        "Scope might exceed one sprint if avatar upload is included. Consider splitting: profile text vs. avatar upload.",
    },
    {
      criterion: "Negotiable",
      feedback:
        "Some flexibility exists but UI is partially prescribed. Remove 'inline editing' to allow team discussion.",
    },
    {
      criterion: "Estimable",
      feedback:
        "Most scope is clear but password confirmation requirement is ambiguous. Clarify security requirements.",
    },
  ],
};
