import React from 'react';
import PropTypes from 'prop-types';
import './PlayerAvatar.css';
// import { getInitials } from '../App'; // Assuming getInitials can be imported or moved

// Moved getInitials function into PlayerAvatar as it's primarily used here
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

const PlayerAvatar = ({ name, token }) => {
  const avatarColor = token === 'X' ? '#a3bffa' : '#ffe066'; // Example colors based on existing styles
  const textColor = token === 'X' ? '#fff' : '#b08968';
  const nameColor = '#2d314d';

  return (
    <div className="player-avatar">
      <div className="avatar" style={{ background: avatarColor, color: textColor }}>
        {getInitials(name) || token}
      </div>
      <span className="player-name" style={{ color: nameColor }}>{name || `Player ${token}`}</span>
    </div>
  );
};

PlayerAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  token: PropTypes.oneOf(['X', 'O']).isRequired,
};

export default PlayerAvatar; 