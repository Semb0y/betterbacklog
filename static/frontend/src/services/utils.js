/**
 * Parse la description Jira au format ADF (Atlassian Document Format)
 * Convertit en texte simple pour l'envoi à Claude
 *
 * @param {object} description - Description au format ADF
 * @returns {string} Description en texte simple
 */
export const parseDescription = (description) => {
  if (!description?.content) {
    return "No description provided";
  }

  return description.content
    .map((block) => parseADFBlock(block))
    .filter(Boolean)
    .join("\n\n");
};

/**
 * Parse un bloc ADF individuel
 * @private
 */
const parseADFBlock = (block) => {
  switch (block.type) {
    case "paragraph":
      return parseParagraph(block);

    case "bulletList":
    case "orderedList":
      return parseList(block);

    case "codeBlock":
      return parseCodeBlock(block);

    case "heading":
      return parseHeading(block);

    case "panel":
      return parsePanel(block);

    case "blockquote":
      return parseBlockquote(block);

    default:
      return "";
  }
};

/**
 * Parse un paragraphe
 * @private
 */
const parseParagraph = (block) => {
  return (
    block.content
      ?.map((item) => {
        if (item.type === "text") return item.text;
        if (item.type === "hardBreak") return "\n";
        if (item.type === "mention") return `@${item.attrs?.text || "user"}`;
        if (item.type === "emoji") return item.attrs?.shortName || "";
        return "";
      })
      .join("") || ""
  );
};

/**
 * Parse une liste (bullet ou ordonnée)
 * @private
 */
const parseList = (block) => {
  return (
    block.content
      ?.map((listItem, index) => {
        const text =
          listItem.content?.[0]?.content?.map((item) => item.text).join("") ||
          "";

        const prefix = block.type === "orderedList" ? `${index + 1}. ` : "• ";

        return `${prefix}${text}`;
      })
      .join("\n") || ""
  );
};

/**
 * Parse un bloc de code
 * @private
 */
const parseCodeBlock = (block) => {
  const code = block.content?.[0]?.text || "";
  const language = block.attrs?.language || "";
  return language
    ? `\`\`\`${language}\n${code}\n\`\`\``
    : `\`\`\`\n${code}\n\`\`\``;
};

/**
 * Parse un heading
 * @private
 */
const parseHeading = (block) => {
  const text = block.content?.map((item) => item.text).join("") || "";
  const level = block.attrs?.level || 1;
  return `${"#".repeat(level)} ${text}`;
};

/**
 * Parse un panel (info, warning, error, success)
 * @private
 */
const parsePanel = (block) => {
  const panelType = block.attrs?.panelType || "info";
  const content =
    block.content?.map((item) => parseADFBlock(item)).join("\n") || "";

  return `[${panelType.toUpperCase()}]\n${content}`;
};

/**
 * Parse une blockquote
 * @private
 */
const parseBlockquote = (block) => {
  const content =
    block.content?.map((item) => parseADFBlock(item)).join("\n") || "";

  return content
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
};

/**
 * Formate une date selon la locale
 *
 * @param {Date|string} date - Date à formater
 * @param {string} locale - Locale (ex: "fr-FR", "en-US")
 * @returns {string} Date formatée
 */
export const formatDate = (date = new Date(), locale = "en-US") => {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  } catch (error) {
    console.error("Failed to format date:", error);
    return new Date(date).toLocaleString();
  }
};

/**
 * Parse la réponse de l'IA (format JSON)
 *
 * @param {object|string} aiResponse - Réponse de Claude
 * @returns {object|null} Objet parsé avec satisfied/notSatisfied/partial
 */
export const parseAnalysisResponse = (aiResponse) => {
  // ✅ Déjà un objet valide
  if (typeof aiResponse === "object" && aiResponse !== null) {
    return validateAnalysisStructure(aiResponse) ? aiResponse : null;
  }

  // ✅ Essayer de parser le JSON
  if (typeof aiResponse === "string") {
    try {
      const parsed = JSON.parse(aiResponse);
      return validateAnalysisStructure(parsed) ? parsed : null;
    } catch (error) {
      console.error("Invalid JSON response from AI:", error);
      return null;
    }
  }

  return null;
};

/**
 * Valide la structure d'une réponse d'analyse
 * @private
 */
const validateAnalysisStructure = (response) => {
  return (
    response &&
    Array.isArray(response.satisfied) &&
    Array.isArray(response.notSatisfied) &&
    Array.isArray(response.partial)
  );
};
