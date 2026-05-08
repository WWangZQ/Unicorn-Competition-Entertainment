import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
  identities: IdentityRow[];
  deviceLinks: DeviceLinkRow[];
}

export interface IdentityRow {
  id: string;
  link_code: string;
  password_hash: string;
  created_at: string;
}

export interface DeviceLinkRow {
  identity_id: string;
  device_id: string;
  ip: string;
  user_agent: string;
  linked_at: string;
  last_active_at: string;
}

export interface Result {
  id: number;
  device_id: string;
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
    return { results: [], questions: [], personalities: [], identities: [], deviceLinks: [] };
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function write(db: DB): void {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

let nextId = 0;

// Results
export function addResult(r: Omit<Result, 'id' | 'created_at'> & { device_id?: string }): void {
  const entry = { ...r, device_id: r.device_id ?? '' };
  const db = read();
  if (nextId === 0) {
    nextId = db.results.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  }
  db.results.push({
    ...entry,
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

// Identity & device linking

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update('kgti_salt_' + password).digest('hex');
}

export function generateLinkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  // Ensure uniqueness
  const db = read();
  if (db.identities.some((id) => id.link_code === code)) {
    return generateLinkCode();
  }
  return code;
}

export function createIdentity(linkCode: string, password: string, deviceId: string, ip: string, userAgent: string): IdentityRow {
  const db = read();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const identity: IdentityRow = {
    id,
    link_code: linkCode,
    password_hash: hashPassword(password),
    created_at: now,
  };
  db.identities.push(identity);
  db.deviceLinks.push({
    identity_id: id,
    device_id: deviceId,
    ip,
    user_agent: userAgent,
    linked_at: now,
    last_active_at: now,
  });
  write(db);
  return identity;
}

export function linkDevice(linkCode: string, password: string, deviceId: string, ip: string, userAgent: string): IdentityRow | null {
  const db = read();
  const identity = db.identities.find((id) => id.link_code === linkCode);
  if (!identity) return null;
  if (identity.password_hash !== hashPassword(password)) return null;

  const now = new Date().toISOString();
  // Update or add device link
  const existing = db.deviceLinks.find((d) => d.identity_id === identity.id && d.device_id === deviceId);
  if (existing) {
    existing.ip = ip;
    existing.user_agent = userAgent;
    existing.last_active_at = now;
  } else {
    db.deviceLinks.push({
      identity_id: identity.id,
      device_id: deviceId,
      ip,
      user_agent: userAgent,
      linked_at: now,
      last_active_at: now,
    });
  }
  write(db);
  return identity;
}

export function getIdentityDevices(identityId: string): { identity: IdentityRow | null; devices: DeviceLinkRow[]; resultCount: number } {
  const db = read();
  const identity = db.identities.find((id) => id.id === identityId) ?? null;
  const devices = db.deviceLinks.filter((d) => d.identity_id === identityId);
  const resultCount = db.results.filter((r) => {
    // Match by any device_id linked to this identity
    return devices.some((d) => d.device_id === r.device_id);
  }).length;
  return { identity, devices, resultCount };
}

export function updateDeviceActivity(identityId: string, deviceId: string): void {
  const db = read();
  const link = db.deviceLinks.find((d) => d.identity_id === identityId && d.device_id === deviceId);
  if (link) {
    link.last_active_at = new Date().toISOString();
    write(db);
  }
}

export function getIdentityByDevice(deviceId: string): IdentityRow | null {
  const db = read();
  const link = db.deviceLinks.find((d) => d.device_id === deviceId);
  if (!link) return null;
  return db.identities.find((id) => id.id === link.identity_id) ?? null;
}
