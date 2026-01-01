export const parseDescription = (description) => {
  if (!description?.content) return "Pas de description";

  return description.content
    .map((block) => {
      if (block.type === "paragraph") {
        return (
          block.content
            ?.map((item) => {
              if (item.type === "text") return item.text;
              if (item.type === "hardBreak") return "\n";
              return "";
            })
            .join("") || ""
        );
      }

      if (block.type === "bulletList" || block.type === "orderedList") {
        return block.content
          ?.map((listItem) => {
            const text = listItem.content?.[0]?.content
              ?.map((item) => item.text)
              .join("");
            return `• ${text}`;
          })
          .join("\n");
      }

      if (block.type === "codeBlock") {
        return `\`\`\`\n${block.content?.[0]?.text || ""}\n\`\`\``;
      }

      if (block.type === "heading") {
        const text = block.content?.map((item) => item.text).join("");
        return `${"#".repeat(block.attrs?.level || 1)} ${text}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
};

export const formatDate = (date = new Date(), locale = "en-US") => {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const parseAnalysisResponse = (aiResponse) => {
  if (typeof aiResponse === "object" && aiResponse !== null) {
    return aiResponse;
  }

  if (typeof aiResponse === "string") {
    try {
      const parsed = JSON.parse(aiResponse);
      return parsed;
    } catch (error) {
      console.error("Failed to parse analysis response as JSON:", error);

      const lines = aiResponse.split("\n").filter((line) => line.trim() !== "");

      const categories = {
        satisfied: [],
        failed: [],
        partial: [],
      };

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("✅")) {
          categories.satisfied.push(trimmedLine);
        } else if (trimmedLine.startsWith("❌")) {
          categories.failed.push(trimmedLine);
        } else if (trimmedLine.startsWith("⚠️")) {
          categories.partial.push(trimmedLine);
        }
      });

      return categories;
    }
  }

  return null;
};
