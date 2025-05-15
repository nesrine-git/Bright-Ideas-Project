import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Light theme with soft neutral background (remove orange)
const lightTheme = {
  mode: 'light',
  colors: {
    text: '#1F2937',               // Tailwind gray-800, matches your ideaCard text-gray-800
    background: '#F9FAFB',         // Tailwind gray-50, a soft neutral light bg (instead of #F5F5F5)
    buttonBg: '#D97706',           // Tailwind amber-600 (warm orange), similar to your yellow button vibes
    buttonHoverBg: '#B45309',      // Tailwind amber-700 (darker orange hover)
    cardBg: '#FFFFFF',             // White background for cards
    border: '#E5E7EB',             // Tailwind gray-200, your border-gray-200 in card
    linkText: '#2563EB',           // Tailwind blue-600, same as your link text-blue-600
    supportBg: '#FEE2E2',          // Light red/pink for "supported" bg (like bg-red-100)
    supportText: '#B91C1C',        // Tailwind red-700 text for support
    inspireBg: '#FEF3C7',          // Light yellow for inspiring bg (like bg-yellow-100)
    inspireText: '#B45309',        // Tailwind amber-700 text for inspire
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    text: '#E5E7EB',               // Tailwind gray-200
    background: '#121212',         // Dark background
    buttonBg: '#2563EB',           // Blue buttons in dark mode (same blue as link in light)
    buttonHoverBg: '#1E40AF',      // Darker blue hover
    cardBg: '#1F2937',             // Tailwind gray-800, dark card bg
    border: '#374151',             // Tailwind gray-700 border
    linkText: '#93C5FD',           // Tailwind blue-300 lighter link in dark
    supportBg: '#B91C1C',          // Dark red bg for support in dark
    supportText: '#FEE2E2',        // Light red text for support
    inspireBg: '#B45309',          // Darker amber bg for inspire
    inspireText: '#FEF3C7',        // Light yellow text for inspire
  },
};


export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }

    // Auto-detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? darkTheme : lightTheme;
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));

    // Add/remove 'dark' class to <html> tag (Tailwind darkMode = 'class')
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
