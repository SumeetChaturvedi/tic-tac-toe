import React from 'react';
import PropTypes from 'prop-types';
import './Controls.css';

const Controls = ({ N, M, playerX, playerO, onNChange, onMChange, onPlayerXChange, onPlayerOChange, onReset, disabled }) => (
  <div className="controls">
    <label htmlFor="board-size-input">
      Board Size (N):
      <input type="number" id="board-size-input" min="3" max="10" value={N} onChange={e => onNChange(Number(e.target.value))} disabled={disabled} />
    </label>
    <label htmlFor="win-length-input">
      Win Length (M):
      <input type="number" id="win-length-input" min="3" max={N} value={M} onChange={e => onMChange(Number(e.target.value))} disabled={disabled} />
    </label>
    <label htmlFor="player-x-input">
      Player X:
      <input type="text" id="player-x-input" value={playerX} onChange={e => onPlayerXChange(e.target.value)} disabled={disabled} />
    </label>
    <label htmlFor="player-o-input">
      Player O:
      <input type="text" id="player-o-input" value={playerO} onChange={e => onPlayerOChange(e.target.value)} disabled={disabled} />
    </label>
    <button onClick={onReset} aria-label="Reset Game">Reset</button>
  </div>
);

Controls.propTypes = {
  N: PropTypes.number.isRequired,
  M: PropTypes.number.isRequired,
  playerX: PropTypes.string.isRequired,
  playerO: PropTypes.string.isRequired,
  onNChange: PropTypes.func.isRequired,
  onMChange: PropTypes.func.isRequired,
  onPlayerXChange: PropTypes.func.isRequired,
  onPlayerOChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Controls; 