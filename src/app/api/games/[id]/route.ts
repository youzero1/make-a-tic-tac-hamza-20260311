import { NextRequest, NextResponse } from 'next/server';
import { getGameRepository } from '@/lib/database';
import { checkWinner, checkDraw, makeMove, isValidMove } from '@/lib/gameLogic';
import type { CellValue } from '@/lib/gameLogic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getGameRepository();
    const game = await repo.findOneBy({ id: parseInt(params.id) });
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    console.error('GET /api/games/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getGameRepository();
    const game = await repo.findOneBy({ id: parseInt(params.id) });
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'in_progress') {
      return NextResponse.json({ error: 'Game is already finished' }, { status: 400 });
    }

    const body = await req.json();
    const { index } = body;

    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Invalid move index' }, { status: 400 });
    }

    const board = JSON.parse(game.board) as CellValue[];

    if (!isValidMove(board, index)) {
      return NextResponse.json({ error: 'Invalid move' }, { status: 400 });
    }

    const newBoard = makeMove(board, index);
    const winner = checkWinner(newBoard);
    const draw = checkDraw(newBoard);

    game.board = JSON.stringify(newBoard);
    if (winner) {
      game.winner = winner;
      game.status = 'won';
    } else if (draw) {
      game.winner = null;
      game.status = 'draw';
    } else {
      game.winner = null;
      game.status = 'in_progress';
    }

    const updated = await repo.save(game);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/games/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}
