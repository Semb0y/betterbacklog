import Resolver from "@forge/resolver";
import { AnalysisResolver } from "./resolvers/analysis.resolver.js";
import { IssueResolver } from "./resolvers/issue.resolver.js";
import { JiraService } from "./services/jira.service";

const resolver = new Resolver();
const issueResolver = new IssueResolver();

resolver.define("getLastAnalysis", (req) =>
  AnalysisResolver.getLastAnalysis(req)
);

resolver.define("fetchAnalysis", (req) => issueResolver.fetchAnalysis(req));

resolver.define("improveBacklog", (req) => issueResolver.improveBacklog(req));

resolver.define("getUserLocale", async () => {
  try {
    const userLocale = await JiraService.getUserLocale();
    return { locale: userLocale };
  } catch (error) {
    console.error("Error getting user locale:", error);
    return { locale: "en_US" };
  }
});

export const handler = resolver.getDefinitions();
