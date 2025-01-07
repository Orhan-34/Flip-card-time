import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  changePrimaryColor: (color: string) => void;
  changeSecondaryColor: (color: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#ff5733');
  const [secondaryColor, setSecondaryColor] = useState('#33ff57');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  const changePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const changeSecondaryColor = (color: string) => {
    setSecondaryColor(color);
    document.documentElement.style.setProperty('--secondary-color', color);
  };

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      secondaryColor, 
      changePrimaryColor, 
      changeSecondaryColor,
      isDark,
      toggleTheme 
    }}>
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