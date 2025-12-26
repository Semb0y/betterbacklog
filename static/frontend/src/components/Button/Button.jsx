import React, { useMemo } from "react";
import styles from "./Button.module.css";
import { CONTENT } from "../../services/constants";

export const Button = ({
  onClick,
  disabled,
  loading,
  isOutdated,
  hasAnalysis,
}) => {
  const label = useMemo(() => {
    if (loading) return CONTENT.STATUS.LOADING;
    if (isOutdated) return CONTENT.STATUS.OUTDATED;
    if (hasAnalysis) return CONTENT.STATUS.UP_TO_DATE;
    return CONTENT.STATUS.DEFAULT;
  }, [loading, isOutdated, hasAnalysis]);

  const icon = useMemo(() => {
    if (isOutdated) return "🔄";
    if (hasAnalysis) return "✅";
    return "✨";
  }, [isOutdated, hasAnalysis]);

  const buttonClassName = `
    ${styles.button} 
    ${loading ? styles.isLoading : ""} 
    ${disabled && !loading ? styles.isDisabled : ""} 
    ${isOutdated ? styles.isOutdated : ""}
  `.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClassName}
    >
      <span className={styles.content}>
        {loading ? (
          <>
            <span className={styles.spinner} />
            <span>{label}</span>
          </>
        ) : (
          <>
            <span className={styles.icon}>{icon}</span>
            <span>{label}</span>
          </>
        )}
      </span>
    </button>
  );
};
