import React from "react";
import { Button } from "../../Button/Button";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage";
import { useTranslations } from "../../../services/hooks/useTranslations";
import styles from "./AnalysisActions.module.css";

export const AnalysisActions = ({
  onAnalyze,
  disabled,
  loading,
  hasAnalysis,
  errorDetails,
  onClearError,
}) => {
  const t = useTranslations();

  return (
    <div className={styles.actionsContainer}>
      <Button
        onClick={onAnalyze}
        disabled={disabled}
        loading={loading}
        hasAnalysis={hasAnalysis}
      />

      <ErrorMessage
        error={errorDetails}
        onRetry={onAnalyze}
        onClose={onClearError}
      />
    </div>
  );
};
