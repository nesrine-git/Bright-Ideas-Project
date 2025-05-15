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
    linkText: '#2563EB',
    buttonLink:'#D97706',           // Tailwind blue-600, same as your link text-blue-600
    supportBg: '#FEE2E2',          // Light red/pink for "supported" bg (like bg-red-100)
    supportText: '#B91C1C',        // Tailwind red-700 text for support
    inspireBg: '#FEF3C7',          // Light yellow for inspiring bg (like bg-yellow-100)
    inspireText: '#B45309',        // Tailwind amber-700 text for inspire
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    cardBg: '#6B7280',          // Tailwind gray-500 as background
    border: '#374151',          // gray-700 border stays
    inspireBg: '#1F2937',       // gray-800 highlight
    text:'rgb(233, 237, 241)', // white/off-white text
    inputText: '#374151',
    linkText: '#F9FAFB',        // white for links
    
    // Transparent button background, white text
    buttonLink:'#FFFFFF',
    buttonBg: 'transparent',    
    buttonText: '#FFFFFF',      // white text on button
    
    supportBg: '#374151',       // dark red bg for support button (if used)
    supportText: '#F9FAFB',     // light red text for support button
    inspireButtonBg: '#374151', // gray-700 bg for inspire button (optional)
    inspireText: '#F9FAFB',     // white text for inspire button
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
