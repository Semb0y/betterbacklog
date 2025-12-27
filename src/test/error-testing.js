import { InputValidator } from "../validators/input.validator.js";
import { JiraService } from "../services/jira.service.js";
import { StorageService } from "../services/storage.service.js";

export class ErrorTesting {
  // Test 1: Validation issueKey invalide
  static testInvalidIssueKey() {
    console.log("🧪 Test: Invalid Issue Key");
    try {
      InputValidator.validateIssueKey("invalid");
      console.log("❌ FAILED: Error not thrown");
    } catch (error) {
      console.log("✅ SUCCESS:", error.message);
    }
  }

  // Test 2: Validation issueKey vide
  static testEmptyIssueKey() {
    console.log("🧪 Test: Empty Issue Key");
    try {
      InputValidator.validateIssueKey("");
      console.log("❌ FAILED: Error not thrown");
    } catch (error) {
      console.log("✅ SUCCESS:", error.message);
    }
  }

  // Test 3: Title trop long
  static testTitleTooLong() {
    console.log("🧪 Test: Title Too Long");
    try {
      const longTitle = "a".repeat(501);
      InputValidator.validateTitle(longTitle);
      console.log("❌ FAILED: Error not thrown");
    } catch (error) {
      console.log("✅ SUCCESS:", error.message);
    }
  }

  // Test 4: Description trop longue
  static testDescriptionTooLong() {
    console.log("🧪 Test: Description Too Long");
    try {
      const longDesc = "a".repeat(10001);
      InputValidator.validateDescription(longDesc);
      console.log("❌ FAILED: Error not thrown");
    } catch (error) {
      console.log("✅ SUCCESS:", error.message);
    }
  }

  // Test 5: Jira issue inexistant
  static async testNonExistentIssue() {
    console.log("🧪 Test: Non-existent Jira Issue");
    try {
      await JiraService.fetchIssue("FAKE-99999");
      console.log("❌ FAILED: Error not thrown");
    } catch (error) {
      console.log("✅ SUCCESS:", error.message);
    }
  }

  // Test 6: Storage vide
  static async testEmptyStorage() {
    console.log("🧪 Test: Empty Storage");
    try {
      const result = await StorageService.getAnalysis("NONEXISTENT-1");
      if (result === null) {
        console.log("✅ SUCCESS: No analysis found");
      } else {
        console.log("❌ FAILED: Should return null");
      }
    } catch (error) {
      console.log("⚠️  UNEXPECTED ERROR:", error.message);
    }
  }

  // Test 7: Tous les tests de validation
  static runValidationTests() {
    console.log("\n========================================");
    console.log("🧪 VALIDATION TESTS");
    console.log("========================================\n");

    this.testInvalidIssueKey();
    this.testEmptyIssueKey();
    this.testTitleTooLong();
    this.testDescriptionTooLong();
  }

  // Test 8: Tous les tests async
  static async runAsyncTests() {
    console.log("\n========================================");
    console.log("🧪 ASYNC TESTS");
    console.log("========================================\n");

    await this.testNonExistentIssue();
    await this.testEmptyStorage();
  }

  // Exécuter tous les tests
  static async runAllTests() {
    this.runValidationTests();
    await this.runAsyncTests();
    console.log("\n✅ All tests completed\n");
  }
}
