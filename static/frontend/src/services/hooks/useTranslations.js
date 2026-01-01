import { useContext } from "react";
import { I18nContext } from "../../App";

export const useTranslations = () => {
  const translations = useContext(I18nContext);

  if (!translations) {
    throw new Error("useTranslations must be used within I18nContext.Provider");
  }

  return translations;
};
