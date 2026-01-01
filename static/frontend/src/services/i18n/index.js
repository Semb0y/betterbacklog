import { TRANSLATIONS } from "./translations";
import { invoke } from "@forge/bridge";

let cachedLocale = null;
let cachedTranslations = null;

export const getUserLocale = async () => {
  if (cachedLocale) return cachedLocale;

  try {
    const result = await invoke("getUserLocale");
    cachedLocale = result.locale || "en_US";
    return cachedLocale;
  } catch (error) {
    console.error("Failed to get user locale:", error);
    cachedLocale = "en_US";
    return cachedLocale;
  }
};

export const getTranslations = async () => {
  if (cachedTranslations) return cachedTranslations;

  const locale = await getUserLocale();

  cachedTranslations =
    TRANSLATIONS[locale] ||
    TRANSLATIONS[locale.split("_")[0]] ||
    TRANSLATIONS["en"];

  return cachedTranslations;
};

export const resetI18nCache = () => {
  cachedLocale = null;
  cachedTranslations = null;
};
