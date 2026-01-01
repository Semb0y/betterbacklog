/**
 * Logger centralisé pour un format cohérent et sécurisé
 */
export class Logger {
  static log(context, level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      context,
      level,
      message,
      ...data,
    };

    if (level === "error") {
      console.error(`[${context}]`, logEntry);
    } else {
      console.log(`[${context}]`, logEntry);
    }
  }

  static info(context, message, data) {
    this.log(context, "info", message, data);
  }

  static warn(context, message, data) {
    this.log(context, "warn", message, data);
  }

  static error(context, message, error, data = {}) {
    this.log(context, "error", message, {
      ...data,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name,
    });
  }

  static sanitize(text, maxLength = 100) {
    if (!text) return "N/A";

    const truncated =
      text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    return truncated.replace(/[^\x20-\x7E]/g, "");
  }

  static getContentMetadata(content) {
    if (!content) {
      return {
        length: 0,
        isEmpty: true,
      };
    }

    return {
      length: content.length,
      isEmpty: content.trim().length === 0,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      preview: this.sanitize(content, 50),
    };
  }

  static getResponseMetadata(response) {
    if (!response) {
      return {
        hasResponse: false,
      };
    }

    const text =
      typeof response === "string" ? response : JSON.stringify(response);

    return {
      hasResponse: true,
      length: text.length,
      isValidJSON: this.isValidJSON(text),
      startsWithBrace: text.trim().startsWith("{"),
      endsWithBrace: text.trim().endsWith("}"),
    };
  }

  static isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  static logAPICall(context, operation, startTime, metadata = {}) {
    const duration = Date.now() - startTime;

    this.info(context, `${operation} completed`, {
      duration_ms: duration,
      ...metadata,
    });
  }
}
