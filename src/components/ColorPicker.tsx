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
    '#4D96FF', // mavi
    '#9FE7E3', // soft turkuaz
    '#FFDAB9', // soft şeftali/somon
    '#FFB5D8', // soft pembe
    '#B5EFC0', // soft yeşil

  ];

  return (
    <div className={`color-picker ${isDark ? 'dark' : 'light'}`}>
      <h3>Text Color</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}>
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