import React, { useEffect, useState } from "react";
import { Box, Stack, xcss } from "@atlaskit/primitives";
import Skeleton from "@atlaskit/skeleton";
import { getTranslations } from "./services/i18n";
import { Analyzer } from "./components/Analyzer/Analyser/Analyzer";
import "./global.css";

export const I18nContext = React.createContext(null);

function App() {
  const [translations, setTranslations] = useState(null);
  const [isLoadingLocale, setIsLoadingLocale] = useState(true);

  useEffect(() => {
    getTranslations()
      .then((t) => {
        setTranslations(t);
      })
      .finally(() => setIsLoadingLocale(false));
  }, []);

  if (isLoadingLocale || !translations) {
    return (
      <Box>
        <Skeleton width="100%" height="32px" />
      </Box>
    );
  }

  return (
    <I18nContext.Provider value={translations}>
      <Analyzer />
    </I18nContext.Provider>
  );
}

export default App;
