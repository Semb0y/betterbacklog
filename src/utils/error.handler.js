import { Logger } from "./logger.js";

/**
 * Classe d'erreur personnalisée pour les erreurs métier
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Gestionnaire d'erreurs centralisé
 */
export class ErrorHandler {
  static handle(context, error, customMessage = null) {
    // Log l'erreur
    Logger.error(context, customMessage || error.message, error);

    // Si c'est une erreur opérationnelle (validation, etc.), on la propage
    if (error instanceof AppError && error.isOperational) {
      throw error;
    }

    // Sinon, on retourne une erreur générique
    throw new AppError(
      customMessage || "An unexpected error occurred",
      500,
      false
    );
  }

  static wrap(context, fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(context, error);
      }
    };
  }
}
