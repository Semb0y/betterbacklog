import Resolver from "@forge/resolver";
import { api, route } from "@forge/api";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const resolver = new Resolver();

resolver.define("fetchAnalysis", async (req) => {
  const { issueKey } = req.payload;
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=summary,description`
    );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du ticket Jira");
  }

  const data = await response.json();
  return {
    title: data.fields.summary,
    description: data.fields.description,
  };
});

resolver.define("improveBacklog", async (req) => {
  const { title, description } = req.payload;

  const prompt = `Voici un ticket Jira. 
  Titre: ${title}
  Description: ${description}
  
  Peux-tu améliorer ce ticket en suivant la structure User Story (En tant que... Je souhaite... Afin de...) et ajouter des critères d'acceptation clairs ?`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    return {
      improvedText: msg.content[0].text,
      additionalInfo: "Improvement made using Claude AI",
    };
  } catch (error) {
    console.error("Détail Erreur Claude:", error.message);
    throw new Error(`L'IA n'a pas pu répondre : ${error.message}`);
  }
});

export const handler = resolver.getDefinitions();
