'use client';

import { getNextPlayer } from '@/lib/gameLogic';
import type { Board } from '@/lib/gameLogic';

interface GameStatusProps {
  board: Board;
  status: string;
  winner: string | null;
}

export default function GameStatus({ board, status, winner }: GameStatusProps) {
  let statusClass = 'game-status game-status--in-progress';
  let message: React.ReactNode;
  let sub: React.ReactNode = null;

  if (status === 'won' && winner) {
    statusClass = 'game-status game-status--won';
    message = (
      <>
        <span className={winner === 'X' ? 'turn-x' : 'turn-o'}>{winner}</span> Wins! 🎉
      </>
    );
  } else if (status === 'draw') {
    statusClass = 'game-status game-status--draw';
    message = "It's a Draw! 🤝";
  } else {
    const next = getNextPlayer(board);
    message = 'Your Turn';
    sub = (
      <div className="turn-indicator">
        Player: <span className={next === 'X' ? 'turn-x' : 'turn-o'}>{next}</span>
      </div>
    );
  }

  return (
    <div className={statusClass}>
      <div>{message}</div>
      {sub}
    </div>
  );
}
