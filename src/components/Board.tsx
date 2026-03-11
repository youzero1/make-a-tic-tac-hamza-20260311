'use client';

import Square from './Square';
import type { Board as BoardType } from '@/lib/gameLogic';

interface BoardProps {
  board: BoardType;
  onSquareClick: (index: number) => void;
  winningSquares: number[] | null;
  gameOver: boolean;
  loading: boolean;
}

export default function Board({
  board,
  onSquareClick,
  winningSquares,
  gameOver,
  loading,
}: BoardProps) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((cell, i) => (
        <Square
          key={i}
          value={cell}
          onClick={() => onSquareClick(i)}
          isWinning={winningSquares ? winningSquares.includes(i) : false}
          disabled={gameOver || loading || cell !== null}
        />
      ))}
    </div>
  );
}
