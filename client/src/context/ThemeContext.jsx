import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  // 1. Check localStorage (user explicitly chose before)
  const stored = localStorage.getItem('trackr_theme');
  if (stored === 'light' || stored === 'dark') return stored;

  // 2. Fall back to OS preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the `.dark` class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement; // the <html> tag

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('trackr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};