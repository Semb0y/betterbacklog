import Resolver from "@forge/resolver";
import { AnalysisResolver } from "./resolvers/analysis.resolver.js";
import { IssueResolver } from "./resolvers/issue.resolver.js";

const resolver = new Resolver();
const issueResolver = new IssueResolver();

resolver.define("getLastAnalysis", (req) =>
  AnalysisResolver.getLastAnalysis(req)
);

resolver.define("fetchAnalysis", (req) => issueResolver.fetchAnalysis(req));

resolver.define("improveBacklog", (req) => issueResolver.improveBacklog(req));

export const handler = resolver.getDefinitions();
