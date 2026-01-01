import React from "react";
import styles from "./Button.module.css";

export const Button = ({ onClick, disabled, loading, hasAnalysis }) => {
  const getButtonText = () => {
    if (loading) return "Analyzing...";
    if (hasAnalysis) return "Re-analyze ticket";
    return "Analyze ticket";
  };

  const getIcon = () => {
    if (hasAnalysis) return "🔄";
    return "✨";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.button} ${loading ? styles.isLoading : ""} ${disabled ? styles.isDisabled : ""}`}
    >
      <span className={styles.content}>
        {loading ? (
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
