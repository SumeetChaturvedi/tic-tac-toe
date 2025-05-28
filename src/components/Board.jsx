import React from 'react';
import './Board.css';

const Board = ({ board, onCellClick, N, winningCells }) => {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {board.map((row, i) =>
        row.map((cell, j) => {
          const isWinningCell = Array.isArray(winningCells) && winningCells.some(([x, y]) => x === i && y === j);
          return (
            <button
              key={`${i}-${j}`}
              className={`cell${isWinningCell ? ' win' : ''}`}
              onClick={() => onCellClick(i, j)}
              disabled={cell !== null}
            >
              {cell}
            </button>
          );
        })
      )}
    </div>
  );
};

export default Board; 