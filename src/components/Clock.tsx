import React, { useState, useContext } from 'react';
import FlipCard from './FlipCard';
import ColorPicker from './ColorPicker';
import { useTime } from '../context/TimeContext';
import { useTheme } from '../context/ThemeContext';
import { BiTime } from 'react-icons/bi';
import '../styles/Clock.css';
import { useColor } from '../context/ColorContext';

export const Clock = () => {
  const { hour, minute, second, is24Hour, toggle24Hour } = useTime();
  const { isDark, toggleTheme } = useTheme();
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(false);
  const { selectedColor } = useColor();

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? 'rgb(17, 24, 39)' : 'rgb(249, 250, 251)',
      color: isDark ? '#FFFFFF' : '#000000',
      transition: 'background 0.3s',
      position: 'relative',
    }}>
      {showDate && (
        <div 
          className={`date-display ${isDark ? 'dark' : 'light'}`}
          data-black-selected={selectedColor === '#000000'}
        >
          <span className="date-numbers" style={{ color: selectedColor }}>
            {getCurrentDate()}
          </span>
        </div>
      )}

      <div className="clock-container">
        <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={hour.charAt(0)} />
          <FlipCard digit={hour.charAt(1)} />
        </div>
        <span className="colon" style={{ 
          color: isDark ? '#FFFFFF' : '#000000',
          fontSize: '3rem',
          fontWeight: 'bold',
          margin: '0 8px'
        }}>:</span>
        <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={minute.charAt(0)} />
          <FlipCard digit={minute.charAt(1)} />
        </div>
        {showSeconds && (
          <>
            <span className="colon" style={{ 
              color: isDark ? '#FFFFFF' : '#000000',
              fontSize: '3rem',
              fontWeight: 'bold',
              margin: '0 8px'
            }}>:</span>
            <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
              <FlipCard digit={second.charAt(0)} />
              <FlipCard digit={second.charAt(1)} />
            </div>
          </>
        )}
      </div>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button
          className={`time-toggle-btn ${isDark ? 'dark' : 'light'}`}
          onClick={toggle24Hour}
          style={{
            padding: '8px 16px',
            background: isDark ? '#2D2D2D' : '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            color: isDark ? '#FFFFFF' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <BiTime size={24} />
          <span style={{ fontSize: '0.8rem' }}>
            {is24Hour ? '12H' : '24H'}
          </span>
        </button>
        
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            background: isDark ? '#2D2D2D' : '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            color: isDark ? '#FFFFFF' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{isDark ? '☀️' : '🌙'}</span>
          <span style={{ fontSize: '0.8rem' }}>{isDark ? 'Light' : 'Dark'}</span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={() => setShowSeconds(!showSeconds)}
          style={{
            padding: '8px 16px',
            background: isDark ? '#2D2D2D' : '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            color: isDark ? '#FFFFFF' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⏱️</span>
          <span style={{ fontSize: '0.8rem' }}>{showSeconds ? 'Hide Sec' : 'Show Sec'}</span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={() => setShowDate(!showDate)}
          style={{
            padding: '8px 16px',
            background: isDark ? '#2D2D2D' : '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            color: isDark ? '#FFFFFF' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📅</span>
          <span style={{ fontSize: '0.8rem' }}>{showDate ? 'Hide Date' : 'Show Date'}</span>
        </button>
      </div>

      <ColorPicker />
    </div>
  );
}; 