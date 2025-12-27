import { storage } from "@forge/api";
import { STORAGE_KEYS } from "../config/constants.js";
import { Logger } from "../utils/logger.js";

export class StorageService {
  static getAnalysisKey(issueKey) {
    return `${STORAGE_KEYS.ANALYSIS_PREFIX}${issueKey}`;
  }

  static async getAnalysis(issueKey) {
    const key = this.getAnalysisKey(issueKey);
    const analysis = await storage.get(key);

    Logger.info("StorageService.getAnalysis", "Retrieved analysis", {
      issueKey,
      found: !!analysis,
    });

    return analysis;
  }

  static async saveAnalysis(issueKey, improvedText, metadata = {}) {
    const key = this.getAnalysisKey(issueKey);
    const analysisData = {
      improvedText,
      date: new Date().toISOString(),
      ...metadata,
    };

    await storage.set(key, analysisData);

    Logger.info("StorageService.saveAnalysis", "Saved analysis", {
      issueKey,
      date: analysisData.date,
      textLength: improvedText.length,
    });

    return analysisData;
  }

  static async deleteAnalysis(issueKey) {
    const key = this.getAnalysisKey(issueKey);
    await storage.delete(key);

    Logger.info("StorageService.deleteAnalysis", "Deleted analysis", {
      issueKey,
    });
  }
}
