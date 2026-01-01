import React from "react";
import styles from "./ErrorMessage.module.css";

export const ErrorMessage = ({ error, onRetry, onClose }) => {
  if (!error) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case "timeout":
        return "⏱️";
      case "cooldown":
        return "⏳";
      case "rate_limit":
        return "🚦";
      case "ai_unavailable":
        return "🔧";
      case "invalid_response":
        return "⚠️";
      case "contact_admin":
        return "📞";
      default:
        return "❌";
    }
  };

  const getActionButton = (action) => {
    switch (action) {
      case "retry":
        return onRetry ? (
          <button onClick={onRetry} className={styles.retryButton}>
            🔄 Try Again
          </button>
        ) : null;

      case "wait":
        return error.remainingSeconds ? (
          <p className={styles.countdown}>
            ⏳ Wait {error.remainingSeconds} seconds
          </p>
        ) : null;

      case "retry_later":
        return <p className={styles.hint}>💡 Try again in a few minutes</p>;

      case "contact_admin":
        return (
          <p className={styles.hint}>
            📞 If this persists, contact your Jira administrator
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorHeader}>
        <span className={styles.icon}>{getErrorIcon(error.type)}</span>
        <span className={styles.title}>Analysis Failed</span>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        )}
      </div>

      <p className={styles.message}>{error.userMessage || error.error}</p>

      <div className={styles.actions}>{getActionButton(error.action)}</div>
    </div>
  );
};
