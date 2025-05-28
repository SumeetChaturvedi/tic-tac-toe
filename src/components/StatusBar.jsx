import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status, currentPlayer, winner, playerX, playerO }) => {
  let message = '';
  if (status === 'playing') {
    message = `Turn: ${currentPlayer === 'X' ? playerX : playerO} (${currentPlayer})`;
  } else if (status === 'win') {
    message = `Winner: ${winner === 'X' ? playerX : playerO} (${winner})!`;
  } else if (status === 'draw') {
    message = "It's a draw!";
  }
  return <div className="status-bar">{message}</div>;
};

export default StatusBar; 