'use client';

interface SquareProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

export default function Square({ value, onClick, isWinning, disabled }: SquareProps) {
  const classes = [
    'square',
    value === 'X' ? 'square--x' : value === 'O' ? 'square--o' : '',
    value ? 'square--occupied' : '',
    disabled && !value ? 'square--disabled' : '',
    isWinning ? 'square--winning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled && !value}
      aria-label={value ? `Square with ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}
