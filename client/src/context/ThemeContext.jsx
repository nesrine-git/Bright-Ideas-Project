import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Define light and dark themes
const lightTheme = {
  mode: 'light',
  text: 'text-black',
  background: 'bg-white',
  buttonBg: 'bg-blue-500',
  cardBg: 'bg-gray-50',
  border: 'border-gray-300',
  linkText: 'text-blue-600',
};

const darkTheme = {
  mode: 'dark',
  text: 'text-white',
  background: 'bg-black',
  buttonBg: 'bg-blue-700',
  cardBg: 'bg-gray-800',
  border: 'border-gray-700',
  linkText: 'text-blue-400',
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load the theme from localStorage, default to light theme
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : lightTheme;
  });

  useEffect(() => {
    // Persist theme selection to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
