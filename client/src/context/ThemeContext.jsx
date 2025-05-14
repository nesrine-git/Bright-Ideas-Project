import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Light theme with soft neutral background (remove orange)
const lightTheme = {
  mode: 'light',
  text: 'text-black',
  background: 'bg-[#F5F5F5]',  // Soft gray for a neutral, calm background
  buttonBg: 'bg-blue-400',     // Blue for buttons for contrast
  cardBg: 'bg-[#ffffff]',      // White cards for better readability
  border: 'border-gray-300',
  linkText: 'text-blue-600',    // Blue text for links
};

// Dark theme (uses system dark mode feel)
const darkTheme = {
  mode: 'dark',
  text: 'text-white',
  background: 'bg-[#121212]', // Darker background for a system-inspired dark mode
  buttonBg: 'bg-blue-700',     // Blue buttons for the dark theme
  cardBg: 'bg-[#1f1f1f]',     // Darker card background
  border: 'border-gray-700',
  linkText: 'text-blue-400',   // Lighter blue text for links
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
