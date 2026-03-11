'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '@/components/Board';
import GameStatus from '@/components/GameStatus';
import GameHistory from '@/components/GameHistory';
import { checkWinner, checkDraw, getWinningSquares } from '@/lib/gameLogic';
import type { CellValue, Board as BoardType } from '@/lib/gameLogic';

interface GameData {
  id: number;
  board: string;
  winner: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [gameId, setGameId] = useState<number | null>(null);
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [status, setStatus] = useState<string>('in_progress');
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const startNewGame = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/games', { method: 'POST' });
      const data: GameData = await res.json();
      setGameId(data.id);
      setBoard(JSON.parse(data.board));
      setStatus(data.status);
      setWinner(data.winner);
    } catch (e) {
      console.error('Failed to start game', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleSquareClick = async (index: number) => {
    if (!gameId || status !== 'in_progress' || board[index] !== null || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index }),
      });

      if (!res.ok) return;

      const data: GameData = await res.json();
      const newBoard = JSON.parse(data.board) as CellValue[];
      setBoard(newBoard);
      setStatus(data.status);
      setWinner(data.winner);

      if (data.status !== 'in_progress') {
        setHistoryKey((k) => k + 1);
      }
    } catch (e) {
      console.error('Failed to make move', e);
    } finally {
      setLoading(false);
    }
  };

  const handleNewGame = async () => {
    await startNewGame();
  };

  const winningSquares = getWinningSquares(board);
  const gameOver = status !== 'in_progress';

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>
      <div className="main-layout">
        <div className="game-section">
          <GameStatus
            board={board}
            status={status}
            winner={winner}
          />
          <Board
            board={board}
            onSquareClick={handleSquareClick}
            winningSquares={winningSquares}
            gameOver={gameOver}
            loading={loading}
          />
          <button className="btn" onClick={handleNewGame} disabled={loading}>
            {loading ? 'Loading...' : 'New Game'}
          </button>
        </div>
        <div>
          <GameHistory key={historyKey} />
        </div>
      </div>
    </div>
  );
}
