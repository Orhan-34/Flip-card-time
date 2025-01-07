/// <reference types="react" />
import React from 'react';
import { useColor } from '../context/ColorContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/FlipCard.css';

interface FlipCardProps {
  digit: string;
  isLast?: boolean;
}

const cardStyle = (isDark: boolean) => ({
  background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  padding: '20px 24px',
  fontSize: '3.5rem',
  fontWeight: '600',
  color: isDark ? '#FFFFFF' : '#000000',
  boxShadow: isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
});

const FlipCard: React.FC<FlipCardProps> = ({ digit, isLast = false }) => {
  const { selectedColor } = useColor();
  const { isDark } = useTheme();

  return (
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="card-top">
          <div className="digit" style={{ color: selectedColor }}>{digit}</div>
        </div>
        <div className="card-bottom">
          <div className="digit" style={{ color: selectedColor }}>{digit}</div>
        </div>
      </div>
      {/*{!isLast && <div className="digit-divider"></div>}*/}
    </div>
  );
};

export default FlipCard; 