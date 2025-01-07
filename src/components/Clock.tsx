import React from 'react';
import FlipCard from './FlipCard';
import ColorPicker from './ColorPicker';
import { useTime } from '../context/TimeContext';
import { useTheme } from '../context/ThemeContext';
import { BiTime } from 'react-icons/bi';
import '../styles/Clock.css';

const Clock: React.FC = () => {
  const { hour, minute, second, is24Hour, toggle24Hour } = useTime();
  const { isDark, toggleTheme } = useTheme();

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
    }}>
      <div className="clock-container">
        <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={hour.charAt(0)} />
          <FlipCard digit={hour.charAt(1)} />
        </div>
        <span className="colon" style={{ color: isDark ? '#333333' : '#E5E7EB' }}>:</span>
        <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={minute.charAt(0)} />
          <FlipCard digit={minute.charAt(1)} />
        </div>
        <span className="colon" style={{ color: isDark ? '#333333' : '#E5E7EB' }}>:</span>
        <div className="time-section" style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={second.charAt(0)} />
          <FlipCard digit={second.charAt(1)} />
        </div>
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
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <BiTime size={20} />
          <span style={{ fontSize: '0.9rem' }}>
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
      </div>

      <ColorPicker />
    </div>
  );
};

export default Clock; 