import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'kgti.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface DB {
  results: Result[];
  questions: QuestionRow[];
  personalities: PersonalityRow[];
}

export interface Result {
  id: number;
  nickname: string;
  personality_code: string;
  personality_name: string;
  dimension_scores: string;
  created_at: string;
}

export interface QuestionRow {
  id: string;
  text: string;
  dimension: string;
  options: string;
  is_hidden: number;
}

export interface PersonalityRow {
  code: string;
  name: string;
  tagline: string;
  dimension: string;
  model: string;
  profile: string;
}

function read(): DB {
  if (!fs.existsSync(dbFile)) {
    return { results: [], questions: [], personalities: [] };
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function write(db: DB): void {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

let nextId = 0;

// Results
export function addResult(r: Omit<Result, 'id' | 'created_at'>): void {
  const db = read();
  if (nextId === 0) {
    nextId = db.results.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  }
  db.results.push({
    ...r,
    id: nextId++,
    created_at: new Date().toISOString(),
  });
  write(db);
}

export function getStats(): { total: number; distribution: { code: string; name: string; count: number }[] } {
  const db = read();
  const dist: Record<string, { code: string; name: string; count: number }> = {};
  for (const r of db.results) {
    if (!dist[r.personality_code]) {
      dist[r.personality_code] = { code: r.personality_code, name: r.personality_name, count: 0 };
    }
    dist[r.personality_code].count++;
  }
  return {
    total: db.results.length,
    distribution: Object.values(dist).sort((a, b) => b.count - a.count),
  };
}

// Questions
export function getQuestions(): QuestionRow[] {
  return read().questions;
}

export function upsertQuestion(q: QuestionRow): void {
  const db = read();
  const idx = db.questions.findIndex((x) => x.id === q.id);
  if (idx >= 0) db.questions[idx] = q;
  else db.questions.push(q);
  write(db);
}

export function deleteQuestion(id: string): void {
  const db = read();
  db.questions = db.questions.filter((q) => q.id !== id);
  write(db);
}

export function questionCount(): number {
  return read().questions.length;
}

// Personalities
export function getPersonalities(): PersonalityRow[] {
  return read().personalities;
}

export function upsertPersonality(p: PersonalityRow): void {
  const db = read();
  const idx = db.personalities.findIndex((x) => x.code === p.code);
  if (idx >= 0) db.personalities[idx] = p;
  else db.personalities.push(p);
  write(db);
}
