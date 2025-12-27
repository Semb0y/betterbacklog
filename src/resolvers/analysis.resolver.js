import { InputValidator } from "../validators/input.validator.js";
import { StorageService } from "../services/storage.service.js";
import { ErrorHandler } from "../utils/error.handler.js";

export class AnalysisResolver {
  static async getLastAnalysis(req) {
    return ErrorHandler.wrap("AnalysisResolver.getLastAnalysis", async () => {
      const { issueKey } = req.payload;
      InputValidator.validateIssueKey(issueKey);

      const analysis = await StorageService.getAnalysis(issueKey);

      if (!analysis) {
        return { found: false };
      }

      return { found: true, ...analysis };
    })();
  }
}
