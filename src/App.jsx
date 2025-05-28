import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import StatusBar from './components/StatusBar';
import PlayerAvatar from './components/PlayerAvatar';
import './App.css';
import confetti from 'canvas-confetti';

const defaultN = 5;
const defaultM = 4;

const emptyBoard = (N) => Array.from({ length: N }, () => Array(N).fill(null));

function checkWin(board, M) {
  const N = board.length;
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down
    [1, -1], // diagonal up
  ];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!board[i][j]) continue;
      for (let [dx, dy] of directions) {
        let k = 0;
        let cells = [];
        while (
          k < M &&
          i + dx * k >= 0 &&
          i + dx * k < N &&
          j + dy * k >= 0 &&
          j + dy * k < N &&
          board[i + dx * k][j + dy * k] === board[i][j]
        ) {
          cells.push([i + dx * k, j + dy * k]);
          k++;
        }
        if (k === M) return { winner: board[i][j], cells };
      }
    }
  }
  return null;
}

function App() {
  // All hooks at the top!
  const [N, setN] = useState(defaultN);
  const [M, setM] = useState(defaultM);
  const [board, setBoard] = useState(emptyBoard(defaultN));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [status, setStatus] = useState('playing'); // playing, win, draw
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [namesEntered, setNamesEntered] = useState(false);
  const [tempX, setTempX] = useState('');
  const [tempO, setTempO] = useState('');
  const [showLobbyAnim, setShowLobbyAnim] = useState(false);
  const [playerXWins, setPlayerXWins] = useState(0);
  const [playerOWins, setPlayerOWins] = useState(0);

  useEffect(() => {
    if (status === 'win' && winningCells.length > 0) {
      // Trigger confetti after win
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          scalar: 0.9,
          zIndex: 1000,
          colors: ['#a3bffa', '#ffe066', '#f8e8ee', '#b6b6e6'],
        });
      }, 200); // Short delay after win status update
    }
  }, [status, winningCells]);

  const handleCellClick = (i, j) => {
    if (board[i][j] || status !== 'playing') return;
    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    const winResult = checkWin(newBoard, M);
    if (winResult) {
      setStatus('win');
      setWinner(winResult.winner);
      setWinningCells(winResult.cells);
      if (winResult.winner === 'X') {
        setPlayerXWins(prevWins => prevWins + 1);
      } else if (winResult.winner === 'O') {
        setPlayerOWins(prevWins => prevWins + 1);
      }
    } else if (newBoard.flat().every(cell => cell)) {
      setStatus('draw');
      setWinner(null);
      setWinningCells([]);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const handleReset = () => {
    setBoard(emptyBoard(N));
    setCurrentPlayer('X');
    setStatus('playing');
    setWinner(null);
    setWinningCells([]);
  };

  const handleNChange = (newN) => {
    setN(newN);
    setM(Math.min(M, newN));
    setBoard(emptyBoard(newN));
    setCurrentPlayer('X');
    setStatus('playing');
    setWinner(null);
    setWinningCells([]);
  };

  const handleMChange = (newM) => {
    setM(newM);
    setBoard(emptyBoard(N));
    setCurrentPlayer('X');
    setStatus('playing');
    setWinner(null);
    setWinningCells([]);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempX.trim() && tempO.trim()) {
      setShowLobbyAnim(true);
      setTimeout(() => {
        setPlayerX(tempX.trim());
        setPlayerO(tempO.trim());
        setNamesEntered(true);
        setShowLobbyAnim(false);
      }, 900);
    }
  };

  // Pre-game lobby with avatars/initials and animation
  if (!namesEntered) {
    return (
      <div className={`app-container${showLobbyAnim ? ' lobby-anim' : ''}`} style={{ minHeight: 420, justifyContent: 'center' }}>
        <h1 style={{ marginBottom: 24 }}>Tic Tac Toe</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
          <PlayerAvatar name={tempX} token="X" />
          <PlayerAvatar name={tempO} token="O" />
        </div>
        <form onSubmit={handleNameSubmit} style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, opacity: showLobbyAnim ? 0.5 : 1, transition: 'opacity 0.5s' }}>
          <label style={{ color: '#2d314d', fontWeight: 600, fontSize: '1.1rem' }}>
            Player X Name:
            <input
              type="text"
              value={tempX}
              onChange={e => setTempX(e.target.value)}
              required
              style={{ marginTop: 6, padding: 10, borderRadius: 10, border: '1.5px solid #a3bffa', fontSize: '1rem', background: '#fff', color: '#2d314d', fontFamily: 'inherit' }}
              placeholder="Enter Player X Name"
              disabled={showLobbyAnim}
            />
          </label>
          <label style={{ color: '#2d314d', fontWeight: 600, fontSize: '1.1rem' }}>
            Player O Name:
            <input
              type="text"
              value={tempO}
              onChange={e => setTempO(e.target.value)}
              required
              style={{ marginTop: 6, padding: 10, borderRadius: 10, border: '1.5px solid #ffe066', fontSize: '1rem', background: '#fff', color: '#b08968', fontFamily: 'inherit' }}
              placeholder="Enter Player O Name"
              disabled={showLobbyAnim}
            />
          </label>
          <button type="submit" style={{ marginTop: 10, padding: '12px 0', borderRadius: 12, background: '#7f9cf5', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px #a3bffa55', transition: 'background 0.2s' }} disabled={showLobbyAnim}>
            {showLobbyAnim ? 'Starting...' : 'Start Game'}
          </button>
        </form>
      </div>
    );
  }

  // Use progressiveWin for highlighting if win, else use winningCells
  let highlightCells = winningCells;
  if (!Array.isArray(highlightCells)) highlightCells = [];

  return (
    <div className="app-container">
      <h1>Tic Tac Toe</h1>
      <StatusBar status={status} currentPlayer={currentPlayer} winner={winner} playerX={playerX} playerO={playerO} />
      <div className="win-counts">
        <span>{playerX}: {playerXWins} Wins</span>
        <span>{playerO}: {playerOWins} Wins</span>
      </div>
      <Controls
        N={N}
        M={M}
        playerX={playerX}
        playerO={playerO}
        onNChange={handleNChange}
        onMChange={handleMChange}
        onPlayerXChange={setPlayerX}
        onPlayerOChange={setPlayerO}
        onReset={handleReset}
        disabled={status !== 'playing' || !namesEntered}
      />
      <Board board={board} onCellClick={handleCellClick} N={N} winningCells={highlightCells} />
    </div>
  );
}

export default App;
