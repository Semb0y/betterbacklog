import React from "react";
import { Button } from "../../Button/Button";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage";
import { CONTENT } from "../../../services/constants";
import styles from "./AnalysisActions.module.css";

export const AnalysisActions = ({
  onAnalyze,
  disabled,
  loading,
  isOutdated,
  hasAnalysis,
  errorDetails,
  onClearError,
}) => {
  return (
    <div className={styles.actionsContainer}>
      <Button
        onClick={onAnalyze}
        disabled={disabled}
        loading={loading}
        isOutdated={isOutdated}
        hasAnalysis={hasAnalysis}
      />

      <ErrorMessage
        error={errorDetails}
        onRetry={onAnalyze}
        onClose={onClearError}
      />

      <p className={styles.disclaimer}>{CONTENT.DISCLAIMER}</p>
    </div>
  );
};
