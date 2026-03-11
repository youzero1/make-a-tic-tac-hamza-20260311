'use client';

import { useEffect, useState } from 'react';

interface GameRecord {
  id: number;
  board: string;
  winner: string | null;
  status: string;
  createdAt: string;
}

function MiniBoard({ board }: { board: string }) {
  const cells: (string | null)[] = JSON.parse(board);
  return (
    <div className="mini-board">
      {cells.map((c, i) => (
        <div key={i} className={`mini-cell ${c === 'X' ? 'mini-x' : c === 'O' ? 'mini-o' : ''}`}>
          {c}
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GameHistory() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/games')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setGames(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="history-section">
      <h2>Game History</h2>
      {fetching ? (
        <p className="loading">Loading...</p>
      ) : games.length === 0 ? (
        <p className="history-empty">No completed games yet. Play one!</p>
      ) : (
        <ul className="history-list">
          {games.map((g) => {
            let resultLabel: string;
            let resultClass: string;
            if (g.status === 'draw') {
              resultLabel = 'Draw';
              resultClass = 'history-item__result result--draw';
            } else if (g.winner === 'X') {
              resultLabel = 'X Wins';
              resultClass = 'history-item__result result--won-x';
            } else {
              resultLabel = 'O Wins';
              resultClass = 'history-item__result result--won-o';
            }
            return (
              <li key={g.id} className="history-item">
                <MiniBoard board={g.board} />
                <div style={{ flex: 1, paddingLeft: '0.5rem' }}>
                  <div className="history-item__id">Game #{g.id}</div>
                  <div className="history-item__date">{formatDate(g.createdAt)}</div>
                </div>
                <span className={resultClass}>{resultLabel}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
