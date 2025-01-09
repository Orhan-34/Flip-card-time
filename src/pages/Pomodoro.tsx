import React from 'react';
import { Link } from 'react-router-dom';

const Pomodoro = () => {
  return (
    <div>
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          textDecoration: 'none',
          color: '#333',
          padding: '8px 16px',
          border: '1px solid #333',
          borderRadius: '4px'
        }}
      >
        Back to Clock
      </Link>
      <h1>Pomodoro Timer</h1>
      {/* Add Pomodoro implementation here */}
    </div>
  );
};

export default Pomodoro; 