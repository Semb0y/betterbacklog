import Resolver from "@forge/resolver";
import { requestJira, route, storage } from "@forge/api";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const resolver = new Resolver();

resolver.define("getLastAnalysis", async (req) => {
  const { issueKey } = req.payload;
  return await storage.get(`analysis-${issueKey}`);
});

resolver.define("fetchAnalysis", async (req) => {
  const { issueKey } = req.payload;
  const response = await requestJira(
    route`/rest/api/3/issue/${issueKey}?fields=summary,description,updated`
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du ticket Jira");
  }

  const data = await response.json();
  return {
    title: data.fields.summary,
    description: data.fields.description,
    updated: data.fields.updated,
  };
});

resolver.define("improveBacklog", async (req) => {
  const { title, description, issueKey } = req.payload;

  const prompt = `Voici un ticket Jira. 
  Titre: ${title}
  Description: ${description}
  
  ${SYSTEM_PROMPT}`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const improvedText = msg.content[0].text;
    const analysisDate = new Date().toISOString();

    await storage.set(`analysis-${issueKey}`, {
      improvedText,
      date: analysisDate,
    });

    return {
      improvedText,
      date: analysisDate,
      additionalInfo: "Improvement made using Claude AI",
    };
  } catch (error) {
    console.error("Détail Erreur Claude:", error.message);
    throw new Error(`L'IA n'a pas pu répondre : ${error.message}`);
  }
});

export const handler = resolver.getDefinitions();
