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
