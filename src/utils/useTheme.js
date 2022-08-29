import { useEffect, useState } from 'react';
import { setToLocalStorage, getFromLocalStorage } from "./generic"
import _ from 'lodash';

export const useTheme = () => {
  const themes = getFromLocalStorage("all-themes");
  const [theme, setTheme] = useState(themes.data.prueba);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode) => {
    setToLocalStorage("theme", mode);
    setTheme(mode);
  };

  const getFonts = () => {
    const allFonts = theme.typography.fontFamily;
    return allFonts;
  };

  useEffect(() => {
    const localTheme = getFromLocalStorage("theme");
    localTheme && themes ? setTheme(localTheme) : setTheme(themes.data.prueba);
    setThemeLoaded(true);
  }, []);

  return { theme, themeLoaded, setMode, getFonts };
};
