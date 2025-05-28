import React from 'react';
import PropTypes from 'prop-types';
import './StatusBar.css';

const StatusBar = ({ status, currentPlayer, winner, playerX, playerO }) => {
  let message = '';
  if (status === 'playing') {
    message = `Turn: ${currentPlayer === 'X' ? playerX : playerO} (${currentPlayer})`;
  } else if (status === 'win') {
    const winnerName = winner === 'X' ? playerX : playerO;
    message = (
      <span style={{ color: winner === 'X' ? '#a3bffa' : '#ffe066', fontWeight: 800, fontSize: '1.6em' }}>
        {winnerName} Wins!
      </span>
    );
  } else if (status === 'draw') {
    message = <span style={{ color: '#b0b0b0', fontWeight: 700, fontSize: '1.4em' }}>It's a draw!</span>;
  }
  return <div className={`status-bar status-bar--${status}`}>{message}</div>;
};

StatusBar.propTypes = {
  status: PropTypes.oneOf(['playing', 'win', 'draw']).isRequired,
  currentPlayer: PropTypes.string.isRequired,
  winner: PropTypes.string,
  playerX: PropTypes.string.isRequired,
  playerO: PropTypes.string.isRequired,
};

export default StatusBar; 