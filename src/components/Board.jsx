import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';

const Board = ({ board, onCellClick, N, winningCells }) => {
  // Add safety check for board
  if (!board || !Array.isArray(board)) {
    return <div>Loading board...</div>;
  }

  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {board.map((row, i) => {
        // Add safety check for each row
        if (!row || !Array.isArray(row)) {
          return null;
        }
        
        return row.map((cell, j) => {
          // Ensure winningCells is an array and use it for checking
          const cellsToCheck = Array.isArray(winningCells) ? winningCells : [];
          const isWinningCell = cellsToCheck.some(([x, y]) => x === i && y === j);
          // Determine the aria-label based on cell content
          const cellContent = cell === null ? 'empty' : cell;
          const ariaLabel = `Row ${i + 1}, Column ${j + 1}, ${cellContent}`;
          return (
            <button
              key={`${i}-${j}`}
              className={`cell${isWinningCell ? ' win' : ''}`}
              onClick={() => onCellClick(i, j)}
              disabled={cell !== null}
              aria-label={ariaLabel}
            >
              {cell}
            </button>
          );
        });
      })}
    </div>
  );
};

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  onCellClick: PropTypes.func.isRequired,
  N: PropTypes.number.isRequired,
  winningCells: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

export default Board;