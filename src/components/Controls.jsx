import React from 'react';
import './Controls.css';

const Controls = ({ N, M, playerX, playerO, onNChange, onMChange, onPlayerXChange, onPlayerOChange, onReset, disabled }) => (
  <div className="controls">
    <label>
      Board Size (N):
      <input type="number" min="3" max="10" value={N} onChange={e => onNChange(Number(e.target.value))} disabled={disabled} />
    </label>
    <label>
      Win Length (M):
      <input type="number" min="3" max={N} value={M} onChange={e => onMChange(Number(e.target.value))} disabled={disabled} />
    </label>
    <label>
      Player X:
      <input type="text" value={playerX} onChange={e => onPlayerXChange(e.target.value)} disabled={disabled} />
    </label>
    <label>
      Player O:
      <input type="text" value={playerO} onChange={e => onPlayerOChange(e.target.value)} disabled={disabled} />
    </label>
    <button onClick={onReset}>Reset</button>
  </div>
);

export default Controls; 