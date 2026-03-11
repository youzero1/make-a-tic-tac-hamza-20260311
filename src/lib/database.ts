import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Game } from '@/entities/Game';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/tictactoe.db';

const resolvedPath = path.resolve(process.cwd(), DATABASE_PATH);
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    entities: [Game],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

export async function getGameRepository() {
  const ds = await getDataSource();
  return ds.getRepository(Game);
}
