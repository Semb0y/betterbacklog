/**
 * Logger centralisé pour un format cohérent
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
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
}
