import React from "react";
import AtlaskitButton from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { useTranslations } from "../../services/hooks/useTranslations";

export const Button = ({ onClick, disabled, loading, hasAnalysis }) => {
  const t = useTranslations();

  const getButtonText = () => {
    if (loading) return t.BUTTON.ANALYZING;
    if (hasAnalysis) return t.BUTTON.RE_ANALYZE;
    return t.BUTTON.ANALYZE;
  };

  const getIcon = () => {
    if (loading) return <Spinner size="small" />;
    if (hasAnalysis) return <span>🔄</span>;
    return <span>✨</span>;
  };

  return (
    <AtlaskitButton
      onClick={onClick}
      isDisabled={disabled || loading}
      appearance="primary"
      shouldFitContainer={false}
      iconBefore={getIcon()}
    >
      {getButtonText()}
    </AtlaskitButton>
  );
};
