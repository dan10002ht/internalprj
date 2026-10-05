import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StudentProgress } from '@/types';

export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface StoredProgress {
  userId: string;
  data: StudentProgress;
  updatedAt: string;
}

/**
 * Lớp lưu trữ có hai bản cài đặt:
 * - Có biến môi trường `DATABASE_URL` (hoặc `POSTGRES_URL`) → dùng Postgres. Dùng khi deploy.
 * - Không có → dùng một file JSON trong `.data/`. Chỉ để chạy thử trên máy, không dùng khi deploy
 *   (Vercel không cho ghi file, và mỗi lần deploy là mất dữ liệu).
 */
export interface Store {
  findUserByUsername(username: string): Promise<User | undefined>;
  findUserById(id: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  createUser(u: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  setPassword(userId: string, passwordHash: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getProgress(userId: string): Promise<StoredProgress | undefined>;
  saveProgress(userId: string, data: StudentProgress): Promise<StoredProgress>;
  listProgress(): Promise<StoredProgress[]>;
}

const CONN = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? '';

// ===== Bản Postgres =====

async function postgresStore(): Promise<Store> {
  const { Pool } = await import('pg');
  const pool = new Pool({
    connectionString: CONN,
    // Các dịch vụ Postgres quản lý (Neon, Supabase, Vercel) đều bắt buộc TLS
    ssl: CONN.includes('localhost') || CONN.includes('127.0.0.1') ? undefined : { rejectUnauthorized: false },
    max: 3,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name  TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'student',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS progress (
      user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data       JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  type Row = { id: string; username: string; password_hash: string; display_name: string; role: Role; created_at: Date };
  const toUser = (r: Row): User => ({
    id: r.id, username: r.username, passwordHash: r.password_hash,
    displayName: r.display_name, role: r.role, createdAt: new Date(r.created_at).toISOString(),
  });
  type PRow = { user_id: string; data: StudentProgress; updated_at: Date };
  const toProgress = (r: PRow): StoredProgress => ({
    userId: r.user_id, data: r.data, updatedAt: new Date(r.updated_at).toISOString(),
  });

  return {
    async findUserByUsername(username) {
      const { rows } = await pool.query<Row>('SELECT * FROM users WHERE username = $1', [username]);
      return rows[0] && toUser(rows[0]);
    },
    async findUserById(id) {
      const { rows } = await pool.query<Row>('SELECT * FROM users WHERE id = $1', [id]);
      return rows[0] && toUser(rows[0]);
    },
    async listUsers() {
      const { rows } = await pool.query<Row>('SELECT * FROM users ORDER BY created_at');
      return rows.map(toUser);
    },
    async createUser(u) {
      const { rows } = await pool.query<Row>(
        'INSERT INTO users (id, username, password_hash, display_name, role) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [randomUUID(), u.username, u.passwordHash, u.displayName, u.role],
      );
      return toUser(rows[0]);
    },
    async setPassword(userId, passwordHash) {
      await pool.query('UPDATE users SET password_hash = $2 WHERE id = $1', [userId, passwordHash]);
    },
    async deleteUser(userId) {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    },
    async getProgress(userId) {
      const { rows } = await pool.query<PRow>('SELECT * FROM progress WHERE user_id = $1', [userId]);
      return rows[0] && toProgress(rows[0]);
    },
    async saveProgress(userId, data) {
      const { rows } = await pool.query<PRow>(
        `INSERT INTO progress (user_id, data, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (user_id) DO UPDATE SET data = $2, updated_at = now() RETURNING *`,
        [userId, data],
      );
      return toProgress(rows[0]);
    },
    async listProgress() {
      const { rows } = await pool.query<PRow>('SELECT * FROM progress');
      return rows.map(toProgress);
    },
  };
}

// ===== Bản file JSON (chỉ để chạy thử trên máy) =====

interface FileShape {
  users: User[];
  progress: StoredProgress[];
}

async function fileStore(): Promise<Store> {
  const file = path.join(process.cwd(), '.data', 'db.json');

  const read = async (): Promise<FileShape> => {
    try {
      return JSON.parse(await readFile(file, 'utf8')) as FileShape;
    } catch {
      return { users: [], progress: [] };
    }
  };
  const write = async (d: FileShape) => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(d, null, 2), 'utf8');
  };

  return {
    async findUserByUsername(username) {
      return (await read()).users.find((u) => u.username === username);
    },
    async findUserById(id) {
      return (await read()).users.find((u) => u.id === id);
    },
    async listUsers() {
      return (await read()).users;
    },
    async createUser(u) {
      const d = await read();
      const user: User = { ...u, id: randomUUID(), createdAt: new Date().toISOString() };
      d.users.push(user);
      await write(d);
      return user;
    },
    async setPassword(userId, passwordHash) {
      const d = await read();
      const u = d.users.find((x) => x.id === userId);
      if (u) u.passwordHash = passwordHash;
      await write(d);
    },
    async deleteUser(userId) {
      const d = await read();
      d.users = d.users.filter((u) => u.id !== userId);
      d.progress = d.progress.filter((p) => p.userId !== userId);
      await write(d);
    },
    async getProgress(userId) {
      return (await read()).progress.find((p) => p.userId === userId);
    },
    async saveProgress(userId, data) {
      const d = await read();
      const row: StoredProgress = { userId, data, updatedAt: new Date().toISOString() };
      const i = d.progress.findIndex((p) => p.userId === userId);
      if (i >= 0) d.progress[i] = row; else d.progress.push(row);
      await write(d);
      return row;
    },
    async listProgress() {
      return (await read()).progress;
    },
  };
}

let cached: Promise<Store> | undefined;

export function getStore(): Promise<Store> {
  if (!CONN && process.env.NODE_ENV === 'production') {
    // Bản lưu file chỉ chạy được trên máy — trên Vercel thư mục chỉ đọc, ghi là hỏng
    throw new Error(
      'Chưa cấu hình DATABASE_URL. Vào Vercel → Storage tạo một Postgres (Neon) và Connect to Project, ' +
      'đặt Custom Prefix là DATABASE, rồi deploy lại.',
    );
  }
  cached ??= CONN ? postgresStore() : fileStore();
  return cached;
}

export const usingDatabase = !!CONN;

/** Tên đăng nhập giáo viên mặc định khi chưa khai `TEACHER_USERNAMES` */
export const DEFAULT_TEACHER_USERNAME = 'giaovien';

/**
 * Tài khoản nào là giáo viên: khai trong biến môi trường `TEACHER_USERNAMES`
 * (nhiều tên cách nhau bằng dấu phẩy). Không khai thì mặc định là `giaovien`.
 */
export function isTeacherUsername(username: string): boolean {
  const list = (process.env.TEACHER_USERNAMES ?? DEFAULT_TEACHER_USERNAME)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(username);
}
