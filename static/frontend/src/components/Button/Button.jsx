import React, { useMemo } from "react";
import styles from "./Button.module.css";
import { CONTENT } from "../../services/constants";

export const Button = ({
  onClick,
  disabled,
  loading,
  isOutdated,
  hasAnalysis,
  isRetrying, // ✅ Nouveau prop
}) => {
  const getButtonText = () => {
    if (isRetrying) return "Retrying...";
    if (loading) return "Analyzing...";
    if (hasAnalysis && !isOutdated) return "Analysis up to date";
    if (isOutdated) return "Issue modified - Re-analyze";
    return "Improve ticket";
  };

  const getIcon = () => {
    if (isRetrying) return "🔄";
    if (isOutdated) return "🔄";
    if (hasAnalysis && !isOutdated) return "✅";
    return "✨";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading || isRetrying}
      className={`${styles.button} ${loading || isRetrying ? styles.isLoading : ""}`}
    >
      <span className={styles.content}>
        {loading || isRetrying ? (
          <>
            <span className={styles.spinner} />
            <span>{getButtonText()}</span>
          </>
        ) : (
          <>
            <span className={styles.icon}>{getIcon()}</span>
            <span>{getButtonText()}</span>
          </>
        )}
      </span>
    </button>
  );
};
