import React, { useState, useRef, useEffect } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import StatusBar from './components/StatusBar';
import confetti from 'canvas-confetti';
import './App.css';

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

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
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
  const [progressiveWin, setProgressiveWin] = useState([]);
  const clickSound = useRef(null);
  const chimeSound = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalWinner, setModalWinner] = useState({ name: '', initials: '', token: '' });

  useEffect(() => {
    if (status === 'win' && winningCells.length > 0) {
      // Animate win highlight step by step
      let idx = 0;
      setProgressiveWin([]);
      const interval = setInterval(() => {
        setProgressiveWin((prev) => [...prev, winningCells[idx]]);
        idx++;
        if (idx >= winningCells.length) {
          clearInterval(interval);
          // Confetti after highlight
          setTimeout(() => {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.3 },
              scalar: 0.8,
              zIndex: 1000,
              colors: ['#a3bffa', '#ffe066', '#f8e8ee', '#b6b6e6'],
            });
          }, 350);
        }
      }, 180);
      // Play chime
      if (chimeSound.current) chimeSound.current.play();
      return () => clearInterval(interval);
    } else {
      setProgressiveWin([]);
    }
  }, [status, winningCells]);

  useEffect(() => {
    if (status === 'win') {
      setTimeout(() => setShowModal(true), 700); // Wait for win animation
    } else {
      setShowModal(false);
    }
  }, [status]);

  // Play click sound on move
  const handleCellClick = (i, j) => {
    if (board[i][j] || status !== 'playing') return;
    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    if (clickSound.current) clickSound.current.currentTime = 0;
    if (clickSound.current) clickSound.current.play();
    const winResult = checkWin(newBoard, M);
    if (winResult) {
      setStatus('win');
      setWinner(winResult.winner);
      setWinningCells(winResult.cells);
      // Store winner info for modal
      const name = winResult.winner === 'X' ? (playerX || 'Player X') : winResult.winner === 'O' ? (playerO || 'Player O') : '';
      const initials = winResult.winner === 'X' ? (getInitials(playerX) || 'X') : winResult.winner === 'O' ? (getInitials(playerO) || 'O') : '';
      setModalWinner({ name, initials, token: winResult.winner });
    } else if (newBoard.flat().every(cell => cell)) {
      setStatus('draw');
      setWinner(null);
      setWinningCells([]);
      setModalWinner({ name: '', initials: '', token: '' });
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
    setProgressiveWin([]);
    setModalWinner({ name: '', initials: '', token: '' });
  };

  const handleNChange = (newN) => {
    setN(newN);
    setM(Math.min(M, newN));
    setBoard(emptyBoard(newN));
    setCurrentPlayer('X');
    setStatus('playing');
    setWinner(null);
    setWinningCells([]);
    setProgressiveWin([]);
  };

  const handleMChange = (newM) => {
    setM(newM);
    setBoard(emptyBoard(N));
    setCurrentPlayer('X');
    setStatus('playing');
    setWinner(null);
    setWinningCells([]);
    setProgressiveWin([]);
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#a3bffa', color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a3bffa55' }}>
              {getInitials(tempX) || 'X'}
            </div>
            <span style={{ color: '#2d314d', fontWeight: 600, fontSize: 16 }}>{tempX || 'Player X'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ffe066', color: '#b08968', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #ffe06655' }}>
              {getInitials(tempO) || 'O'}
            </div>
            <span style={{ color: '#2d314d', fontWeight: 600, fontSize: 16 }}>{tempO || 'Player O'}</span>
          </div>
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
        <audio ref={clickSound} src="/sounds/click.mp3" preload="auto" />
        <audio ref={chimeSound} src="/sounds/chime.mp3" preload="auto" />
      </div>
    );
  }

  // Use progressiveWin for highlighting if win, else use winningCells
  let highlightCells = status === 'win' && progressiveWin.length > 0 ? progressiveWin : winningCells;
  if (!Array.isArray(highlightCells)) highlightCells = [];

  // Modal styles
  const modalStyles = {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(240, 244, 255, 0.55)',
    zIndex: 2000,
    backdropFilter: 'blur(6px)',
    transition: 'background 0.4s',
  };
  const modalCardStyles = {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    boxShadow: '0 8px 32px #a3bffa55',
    padding: '40px 32px 32px 32px',
    minWidth: 320,
    maxWidth: '90vw',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    animation: 'modal-pop 0.5s cubic-bezier(.23,1.12,.62,1.01)',
  };
  const modalBtn = {
    border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem', padding: '12px 28px', margin: '12px 10px 0 10px', cursor: 'pointer', boxShadow: '0 2px 8px #a3bffa33', fontFamily: 'inherit', transition: 'background 0.2s',
  };

  const handlePlayAgain = () => {
    setShowModal(false);
    handleReset();
  };
  const handleChangePlayers = () => {
    setShowModal(false);
    setNamesEntered(false);
    setPlayerX('');
    setPlayerO('');
    setTempX('');
    setTempO('');
    handleReset();
  };

  return (
    <div className="app-container" style={showModal ? { filter: 'blur(4px) brightness(0.92)', pointerEvents: 'none', userSelect: 'none', transition: 'filter 0.4s' } : {}}>
      <h1>Tic Tac Toe</h1>
      <StatusBar status={status} currentPlayer={currentPlayer} winner={winner} playerX={playerX} playerO={playerO} />
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
      <audio ref={clickSound} src="/sounds/click.mp3" preload="auto" />
      <audio ref={chimeSound} src="/sounds/chime.mp3" preload="auto" />
      {showModal && modalWinner.name && (
        <div style={modalStyles}>
          <div style={modalCardStyles}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{modalWinner.initials}</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#7f9cf5', marginBottom: 8 }}>
              {modalWinner.name} <span style={{ fontWeight: 400, fontSize: 22, color: '#b08968' }}>({modalWinner.token})</span>
            </div>
            <div style={{ color: '#b08968', fontWeight: 600, fontSize: 18, marginBottom: 18 }}>
              Connected {M} on a {N}x{N} board
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ ...modalBtn, background: '#a3bffa', color: '#fff' }} onClick={handlePlayAgain}>Play Again</button>
              <button style={{ ...modalBtn, background: '#ffe066', color: '#b08968' }} onClick={handleChangePlayers}>Change Players</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
