export interface Theme {
  background: string;
  cardBackground: string;
  separator: string;
  button: string;
}

export interface TimeContextType {
  hour: string;
  minute: string;
  second: string;
  is24Hour: boolean;
  toggle24Hour: () => void;
}

export type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

export interface ColorContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
} 