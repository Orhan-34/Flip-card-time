/// <reference types="react" />
import React from 'react';
import { useColor } from '../context/ColorContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/FlipCard.css';

interface FlipCardProps {
  digit: string;
  isLast?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ digit, isLast = false }) => {
  const { primaryColor } = useColor();
  const { isDark } = useTheme();

  return (
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="card-top">
          <div className="digit" style={{ color: primaryColor }}>{digit}</div>
        </div>
        <div className="card-bottom">
          <div className="digit" style={{ color: primaryColor }}>{digit}</div>
        </div>
      </div>
      {/*{!isLast && <div className="digit-divider"></div>}*/}
    </div>
  );
};

export default FlipCard; 