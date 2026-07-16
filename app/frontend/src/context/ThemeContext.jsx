import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('predictwell_theme');
    return stored ? stored === 'dark' : true; // dark by default — this is an AI dashboard, not a spreadsheet
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('predictwell_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};
