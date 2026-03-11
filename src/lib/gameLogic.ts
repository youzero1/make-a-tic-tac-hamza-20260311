export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): CellValue {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function getNextPlayer(board: Board): 'X' | 'O' {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export function isValidMove(board: Board, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}

export function makeMove(board: Board, index: number): Board {
  if (!isValidMove(board, index)) {
    throw new Error('Invalid move');
  }
  const newBoard = [...board];
  newBoard[index] = getNextPlayer(board);
  return newBoard;
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function getWinningSquares(board: Board): number[] | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}
