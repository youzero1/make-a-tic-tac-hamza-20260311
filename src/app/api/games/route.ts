import { NextRequest, NextResponse } from 'next/server';
import { getGameRepository } from '@/lib/database';
import { createEmptyBoard } from '@/lib/gameLogic';
import { Game } from '@/entities/Game';

export async function POST(_req: NextRequest) {
  try {
    const repo = await getGameRepository();
    const game = new Game();
    game.board = JSON.stringify(createEmptyBoard());
    game.winner = null;
    game.status = 'in_progress';
    const saved = await repo.save(game);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const repo = await getGameRepository();
    const games = await repo.find({
      where: [
        { status: 'won' },
        { status: 'draw' },
      ],
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
