import React from 'react';
import { useColor } from '../context/ColorContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/ColorPicker.css';

const ColorPicker: React.FC = () => {
  const { selectedColor, setSelectedColor } = useColor();
  const { isDark } = useTheme();
  
  const colors = [
    '#000000', // Siyah renk eklendi
    '#FF6B6B', // kırmızımsı
    '#7BEF8E', // yeşil
    '#4D96FF', // mavi
    '#FF69B4', // pembe
    '#68E8DB', // turkuaz
    '#FFEB3B'  // sarı
  ];

  return (
    <div className={`color-picker ${isDark ? 'dark' : 'light'}`}>
      <h3>Ana Renk</h3>
      <div className="color-options">
        {colors.map((color, index) => (
          <button
            key={index}
            className={`color-option ${color === selectedColor ? 'selected' : ''} ${color === '#000000' ? 'black-option' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker; 