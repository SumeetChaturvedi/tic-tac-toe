import React from 'react';
import './Cell.css';

const Cell = ({ value, onClick, highlight }) => (
  <button className={`cell${highlight ? ' win' : ''}`} onClick={onClick} disabled={value !== null}>
    {value}
  </button>
);

export default Cell; 