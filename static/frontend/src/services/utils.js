export const parseDescription = (description) => {
  if (!description?.content) {
    return "No description provided";
  }

  return description.content
    .map((block) => parseADFBlock(block))
    .filter(Boolean)
    .join("\n\n");
};

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

const parseCodeBlock = (block) => {
  const code = block.content?.[0]?.text || "";
  const language = block.attrs?.language || "";
  return language
    ? `\`\`\`${language}\n${code}\n\`\`\``
    : `\`\`\`\n${code}\n\`\`\``;
};

const parseHeading = (block) => {
  const text = block.content?.map((item) => item.text).join("") || "";
  const level = block.attrs?.level || 1;
  return `${"#".repeat(level)} ${text}`;
};

const parsePanel = (block) => {
  const panelType = block.attrs?.panelType || "info";
  const content =
    block.content?.map((item) => parseADFBlock(item)).join("\n") || "";

  return `[${panelType.toUpperCase()}]\n${content}`;
};

const parseBlockquote = (block) => {
  const content =
    block.content?.map((item) => parseADFBlock(item)).join("\n") || "";

  return content
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
};

export const formatDate = (date = new Date(), locale = "en_US") => {
  try {
    const normalizedLocale = locale.replace("_", "-");

    return new Intl.DateTimeFormat(normalizedLocale, {
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

export const parseAnalysisResponse = (aiResponse) => {
  if (typeof aiResponse === "object" && aiResponse !== null) {
    return validateAnalysisStructure(aiResponse) ? aiResponse : null;
  }

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

const validateAnalysisStructure = (response) => {
  return (
    response &&
    Array.isArray(response.satisfied) &&
    Array.isArray(response.notSatisfied) &&
    Array.isArray(response.partial)
  );
};
